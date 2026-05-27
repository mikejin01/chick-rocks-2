"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { getCateringProduct } from "@/lib/data/catering-products";
import {
  computeCateringOrder,
  ORDER_MINIMUM_CENTS,
  TAX_RATE,
  TIP_CHOICES,
  type CartLine,
  type TipOption,
} from "@/lib/catering-order";
import { STORES, type Store } from "@/lib/stores";

// Cart + pickup state shared across the catering order and checkout pages.
// Persisted to sessionStorage so it survives navigation between the two routes
// (and a refresh) without a backend. Order math (tax/tip/total/minimum) lives in
// @/lib/catering-order so the server can recompute it; re-export the constants so
// existing consumers can keep importing them from this context.
export { ORDER_MINIMUM_CENTS, TAX_RATE, TIP_CHOICES };
export type { CartLine, TipOption };

type Cart = Record<string, number>; // productId -> quantity
type Options = Record<string, string>; // productId -> chosen option (e.g. "Spicy")

type CateringCartValue = {
  hydrated: boolean;
  cart: Cart;
  selectedOptions: Options;
  storeId: Store["id"];
  store: Store;
  tipOption: TipOption;
  customTip: string;
  lines: CartLine[];
  itemCount: number;
  foodCents: number;
  taxCents: number;
  tipCents: number;
  totalCents: number;
  belowMinimum: boolean;
  shortfallCents: number;
  addItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  setOption: (id: string, opt: string) => void;
  setStoreId: (id: Store["id"]) => void;
  setTipOption: (t: TipOption) => void;
  setCustomTip: (v: string) => void;
  clearCart: () => void;
};

const CateringCartContext = createContext<CateringCartValue | null>(null);

const STORAGE_KEY = "cr-catering-cart-v1";
const DEFAULT_STORE_ID: Store["id"] = "astoria";

type Persisted = {
  cart: Cart;
  selectedOptions: Options;
  storeId: Store["id"];
  tipOption: TipOption;
  customTip: string;
};

export const CateringCartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>({});
  const [selectedOptions, setSelectedOptions] = useState<Options>({});
  const [storeId, setStoreId] = useState<Store["id"]>(DEFAULT_STORE_ID);
  const [tipOption, setTipOption] = useState<TipOption>("15");
  const [customTip, setCustomTip] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage once on the client (after the first paint, to
  // avoid a server/client mismatch).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Persisted>;
        if (p.cart) setCart(p.cart);
        if (p.selectedOptions) setSelectedOptions(p.selectedOptions);
        if (p.storeId) setStoreId(p.storeId);
        if (p.tipOption) setTipOption(p.tipOption);
        if (typeof p.customTip === "string") setCustomTip(p.customTip);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Persist on change (only after hydration, so we don't clobber stored state).
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cart, selectedOptions, storeId, tipOption, customTip } satisfies Persisted)
      );
    } catch {
      /* ignore quota errors */
    }
  }, [hydrated, cart, selectedOptions, storeId, tipOption, customTip]);

  const addItem = useCallback((id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    const product = getCateringProduct(id);
    if (!product) return;
    // Default the flavor the first time an item with options is added.
    if (product.options?.length) {
      setSelectedOptions((prev) => (prev[id] ? prev : { ...prev, [id]: product.options![0] }));
    }
    toast.success(`Added ${product.name}`);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: qty };
    });
    if (qty <= 0) {
      setSelectedOptions((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }, []);

  const setOption = useCallback((id: string, opt: string) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: opt }));
  }, []);

  const clearCart = useCallback(() => {
    setCart({});
    setSelectedOptions({});
  }, []);

  const store = useMemo(() => STORES.find((s) => s.id === storeId) ?? STORES[0], [storeId]);

  const {
    lines,
    itemCount,
    foodCents,
    taxCents,
    tipCents,
    totalCents,
    belowMinimum,
    shortfallCents,
  } = useMemo(
    () => computeCateringOrder({ cart, selectedOptions, tipOption, customTip }),
    [cart, selectedOptions, tipOption, customTip]
  );

  const value: CateringCartValue = {
    hydrated,
    cart,
    selectedOptions,
    storeId,
    store,
    tipOption,
    customTip,
    lines,
    itemCount,
    foodCents,
    taxCents,
    tipCents,
    totalCents,
    belowMinimum,
    shortfallCents,
    addItem,
    setQty,
    setOption,
    setStoreId,
    setTipOption,
    setCustomTip,
    clearCart,
  };

  return <CateringCartContext.Provider value={value}>{children}</CateringCartContext.Provider>;
};

export const useCateringCart = () => {
  const ctx = useContext(CateringCartContext);
  if (!ctx) throw new Error("useCateringCart must be used within a CateringCartProvider");
  return ctx;
};
