import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db, orders, type OrderItem } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { computeCateringOrder, type TipOption } from "@/lib/catering-order";
import { eq } from "drizzle-orm";

// Route handlers run on Node by default; pin it so the Stripe SDK and Neon driver
// behave consistently across environments.
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-.\s]{7,}$/;
const STORE_IDS = ["astoria", "flushing"] as const;
const TIP_OPTIONS: TipOption[] = ["10", "15", "20", "other"];

type CheckoutBody = {
  storeId?: unknown;
  cart?: unknown;
  selectedOptions?: unknown;
  tipOption?: unknown;
  customTip?: unknown;
  pickup?: { date?: unknown; time?: unknown };
  customer?: {
    firstName?: unknown;
    lastName?: unknown;
    phone?: unknown;
    email?: unknown;
  };
};

// Derived via indexed access — the nested `SessionCreateParams.LineItem` namespace
// member isn't surfaced on the top-level Stripe types in this SDK version.
type CheckoutLineItem = NonNullable<Stripe.Checkout.SessionCreateParams["line_items"]>[number];

const isCartRecord = (v: unknown): v is Record<string, number> =>
  typeof v === "object" &&
  v !== null &&
  Object.values(v).every((n) => typeof n === "number");

// Build a pickup Date from "YYYY-MM-DD" + a decimal hour (e.g. 11.5 = 11:30,
// 25.5 = 1:30 AM the next day). Informational only — the authoritative pickup
// time is also written to the order notes as a human-readable string.
const pickupDate = (date: string, time: number): Date | null => {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d || Number.isNaN(time)) return null;
  const dayOffset = Math.floor(time / 24);
  const hour = Math.floor(time) % 24;
  const min = Math.round((time - Math.floor(time)) * 60);
  return new Date(y, m - 1, d + dayOffset, hour, min);
};

const formatHour = (h: number): string => {
  const wrapped = h >= 24 ? h - 24 : h;
  const hour = Math.floor(wrapped);
  const min = Math.round((wrapped - hour) * 60);
  const period = hour >= 12 ? "PM" : "AM";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return min === 0 ? `${display} ${period}` : `${display}:${String(min).padStart(2, "0")} ${period}`;
};

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // --- Validate the customer + pickup inputs -------------------------------
  const storeId = body.storeId;
  if (storeId !== "astoria" && storeId !== "flushing") {
    return NextResponse.json({ error: "Invalid store." }, { status: 400 });
  }

  const firstName = String(body.customer?.firstName ?? "").trim();
  const lastName = String(body.customer?.lastName ?? "").trim();
  const phone = String(body.customer?.phone ?? "").trim();
  const email = String(body.customer?.email ?? "").trim();
  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "A valid phone number is required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const date = String(body.pickup?.date ?? "");
  const time = Number(body.pickup?.time);
  const eventDate = pickupDate(date, time);
  if (!eventDate) {
    return NextResponse.json({ error: "Choose a pickup date and time." }, { status: 400 });
  }

  // --- Recompute the cart from the live catalog (never trust client prices) -
  if (!isCartRecord(body.cart)) {
    return NextResponse.json({ error: "Invalid cart." }, { status: 400 });
  }
  const tipOption = TIP_OPTIONS.includes(body.tipOption as TipOption)
    ? (body.tipOption as TipOption)
    : "15";
  const selectedOptions =
    typeof body.selectedOptions === "object" && body.selectedOptions !== null
      ? (body.selectedOptions as Record<string, string>)
      : {};

  const order = computeCateringOrder({
    cart: body.cart,
    selectedOptions,
    tipOption,
    customTip: typeof body.customTip === "string" ? body.customTip : "",
  });

  if (order.lines.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  if (order.belowMinimum) {
    return NextResponse.json(
      { error: "Order is below the catering minimum." },
      { status: 400 }
    );
  }

  // --- Persist a pending order ---------------------------------------------
  const items: OrderItem[] = order.lines.map((l) => ({
    name: l.product.name,
    quantity: l.qty,
    unitPriceCents: l.product.priceCents,
    notes: l.option,
  }));

  const pickupLabel = `${date} at ${formatHour(time)}`;
  const customerName = `${firstName} ${lastName}`;

  let orderId: string;
  try {
    const [row] = await db
      .insert(orders)
      .values({
        storeId,
        fulfillmentMethod: "pickup",
        customerName,
        customerEmail: email,
        customerPhone: phone,
        eventDate,
        items,
        subtotalCents: order.foodCents,
        taxCents: order.taxCents,
        tipCents: order.tipCents,
        totalCents: order.totalCents,
        notes: `Pickup ${pickupLabel}`,
        status: "pending",
      })
      .returning({ id: orders.id });
    orderId = row.id;
  } catch (err) {
    console.error("Failed to create order:", err);
    return NextResponse.json({ error: "Could not start your order." }, { status: 500 });
  }

  // --- Create the Stripe Checkout Session ----------------------------------
  // The catalog items, tax, and tip each become their own line so the Stripe
  // total exactly matches the order total we computed and stored.
  const lineItems: CheckoutLineItem[] = order.lines.map((l) => ({
    quantity: l.qty,
    price_data: {
      currency: "usd",
      unit_amount: l.product.priceCents,
      product_data: {
        name: l.option ? `${l.product.name} (${l.option})` : l.product.name,
      },
    },
  }));
  if (order.taxCents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: order.taxCents,
        product_data: { name: "Sales tax (8.875%)" },
      },
    });
  }
  if (order.tipCents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: order.tipCents,
        product_data: { name: "Tip" },
      },
    });
  }

  // Prefer the request origin so success/cancel URLs work in dev and prod alike.
  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    new URL(req.url).origin;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: email,
      client_reference_id: orderId,
      metadata: { orderId, storeId, pickup: pickupLabel },
      payment_intent_data: { metadata: { orderId } },
      success_url: `${origin}/catering/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/catering/checkout`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    await db
      .update(orders)
      .set({ stripeCheckoutSessionId: session.id })
      .where(eq(orders.id, orderId));

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Failed to create Stripe session:", err);
    return NextResponse.json({ error: "Could not start payment." }, { status: 500 });
  }
}
