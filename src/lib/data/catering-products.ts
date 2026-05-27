// Catering catalog. The source of truth is catering-menu.json (editable without code
// changes — flip `in_stock` to take an item on/offline). This module loads that JSON and
// exposes it as a typed, camelCase shape. Prices are integer cents to match the orders
// schema (src/lib/db/schema.ts → OrderItem.unitPriceCents).
import cateringMenu from "./catering-menu.json";

export type CateringProduct = {
  id: string;
  category: string;
  name: string;
  description: string;
  priceCents: number;
  image: string; // path under /public
  inStock: boolean;
  options?: string[]; // e.g. ["Spicy", "Mild"] — flavor choice the customer picks in the cart
};

// Raw shape as stored in catering-menu.json (snake_case).
type RawCateringProduct = {
  id: string;
  category: string;
  name: string;
  description: string;
  price_cents: number;
  image: string;
  in_stock: boolean;
  options?: string[];
};

export const CATERING_PRODUCTS: CateringProduct[] = (cateringMenu as RawCateringProduct[]).map(
  (p) => ({
    id: p.id,
    category: p.category,
    name: p.name,
    description: p.description,
    priceCents: p.price_cents,
    image: p.image,
    inStock: p.in_stock,
    options: p.options,
  })
);

export const formatPrice = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export const getCateringProduct = (id: string) =>
  CATERING_PRODUCTS.find((p) => p.id === id);
