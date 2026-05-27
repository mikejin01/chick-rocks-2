import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** A single catering line item, snapshotted onto the order at checkout time. */
export type OrderItem = {
  name: string;
  quantity: number;
  unitPriceCents: number;
  notes?: string;
};

export const orderStatusEnum = pgEnum("order_status", [
  "pending", // created, awaiting payment
  "paid", // Stripe payment succeeded
  "confirmed", // store accepted the catering order
  "fulfilled", // completed / picked up / delivered
  "cancelled",
  "refunded",
]);

export const fulfillmentMethodEnum = pgEnum("fulfillment_method", ["pickup", "delivery"]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Which location fulfills the order — matches STORES ids in src/lib/stores.ts.
  storeId: text("store_id").$type<"flushing" | "astoria">().notNull(),
  fulfillmentMethod: fulfillmentMethodEnum("fulfillment_method").notNull().default("pickup"),

  // Customer contact
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),

  // Catering event details
  eventDate: timestamp("event_date", { withTimezone: true }),
  guestCount: integer("guest_count"),
  deliveryAddress: text("delivery_address"),
  notes: text("notes"),

  // Line items snapshot (name/qty/price captured at order time, independent of the live menu)
  items: jsonb("items").$type<OrderItem[]>().notNull(),

  // Money, stored as integer cents to avoid floating-point rounding.
  // subtotalCents = food & beverage; total = subtotal + tax + tip.
  subtotalCents: integer("subtotal_cents").notNull(),
  taxCents: integer("tax_cents").notNull().default(0),
  tipCents: integer("tip_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),

  // Order lifecycle + Stripe linkage
  status: orderStatusEnum("status").notNull().default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
