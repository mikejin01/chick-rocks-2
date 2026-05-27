import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

// Looks up a Checkout Session so the confirmation page can show real order details
// and only celebrate a genuinely paid session. Returns a minimal, safe subset.
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing session id." }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(id);
    return NextResponse.json({
      paid: session.payment_status === "paid",
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email ?? session.customer_email,
      storeId: session.metadata?.storeId ?? null,
      pickup: session.metadata?.pickup ?? null,
    });
  } catch (err) {
    console.error("Failed to retrieve checkout session:", err);
    return NextResponse.json({ error: "Could not load your order." }, { status: 404 });
  }
}
