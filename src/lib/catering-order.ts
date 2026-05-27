// Pure order math for the catering cart. Lives apart from the React context so the
// /api/checkout route can recompute the same totals server-side from the catalog —
// the client's prices are never trusted when creating a Stripe session.
import {
  getCateringProduct,
  type CateringProduct,
} from "@/lib/data/catering-products";

export const TAX_RATE = 0.08875; // 8.875% NYC sales tax
export const ORDER_MINIMUM_CENTS = 10000; // $100 food & beverage minimum, before tax/tip

export type TipOption = "10" | "15" | "20" | "other";

export const TIP_CHOICES: { key: TipOption; label: string }[] = [
  { key: "10", label: "10%" },
  { key: "15", label: "15%" },
  { key: "20", label: "20%" },
  { key: "other", label: "Other" },
];

export type CartLine = {
  product: CateringProduct;
  qty: number;
  option?: string;
  lineTotalCents: number;
};

export type CartState = {
  cart: Record<string, number>; // productId -> quantity
  selectedOptions?: Record<string, string>; // productId -> chosen option (e.g. "Spicy")
  tipOption: TipOption;
  customTip?: string;
};

export type ComputedOrder = {
  lines: CartLine[];
  itemCount: number;
  foodCents: number;
  taxCents: number;
  tipCents: number;
  totalCents: number;
  belowMinimum: boolean;
  shortfallCents: number;
};

// Resolve a cart into priced lines + totals, always from the live catalog. Unknown
// product ids and non-positive quantities are dropped, so a tampered client payload
// can only ever under-order, never invent prices or items.
export const computeCateringOrder = ({
  cart,
  selectedOptions = {},
  tipOption,
  customTip = "",
}: CartState): ComputedOrder => {
  const lines: CartLine[] = Object.entries(cart)
    .map(([id, qty]): CartLine | null => {
      const product = getCateringProduct(id);
      if (!product || !product.inStock || qty <= 0) return null;
      // Only keep a chosen option if it's one the product actually offers.
      const raw = selectedOptions[id];
      const option = raw && product.options?.includes(raw) ? raw : undefined;
      return { product, qty, option, lineTotalCents: product.priceCents * qty };
    })
    .filter((l): l is CartLine => l !== null);

  const foodCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const taxCents = Math.round(foodCents * TAX_RATE);
  const tipCents =
    tipOption === "other"
      ? Math.max(0, Math.round((parseFloat(customTip) || 0) * 100))
      : Math.round(foodCents * (Number(tipOption) / 100));
  const totalCents = foodCents + taxCents + tipCents;
  const belowMinimum = foodCents < ORDER_MINIMUM_CENTS;
  const shortfallCents = Math.max(0, ORDER_MINIMUM_CENTS - foodCents);

  return {
    lines,
    itemCount,
    foodCents,
    taxCents,
    tipCents,
    totalCents,
    belowMinimum,
    shortfallCents,
  };
};
