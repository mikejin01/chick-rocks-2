"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Trash2, Utensils, X } from "lucide-react";
import CateringOrderMinimumModal from "@/components/CateringOrderMinimumModal";
import CateringStoreSelector from "@/components/CateringStoreSelector";
import Seo, { breadcrumbLd, SITE } from "@/components/Seo";
import { CATERING_PRODUCTS, formatPrice } from "@/lib/data/catering-products";
import {
  ORDER_MINIMUM_CENTS,
  TIP_CHOICES,
  useCateringCart,
} from "@/contexts/CateringCartContext";
import { cn } from "@/lib/utils";

// Categories in first-seen order, so the nav and sections follow the JSON ordering.
const CATEGORIES = CATERING_PRODUCTS.reduce<string[]>((acc, p) => {
  if (!acc.includes(p.category)) acc.push(p.category);
  return acc;
}, []);

const catId = (category: string) => `cat-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const CateringOrder = () => {
  const router = useRouter();
  const {
    cart,
    storeId,
    store,
    itemCount,
    foodCents,
    belowMinimum,
    shortfallCents,
    addItem,
    setQty,
    setStoreId,
  } = useCateringCart();

  const [minModalOpen, setMinModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // mobile cart sheet
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const navRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Scroll-spy: highlight the category whose section is sitting at the top of the viewport.
  useEffect(() => {
    const visible: Record<string, boolean> = {};
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const cat = entry.target.getAttribute("data-cat");
          if (cat) visible[cat] = entry.isIntersecting;
        }
        const top = CATEGORIES.find((c) => visible[c]);
        if (top) setActiveCat(top);
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 }
    );
    CATEGORIES.forEach((c) => {
      const el = sectionRefs.current[c];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Keep the active tab in view inside the horizontal nav as the user scrolls.
  useEffect(() => {
    navRefs.current[activeCat]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeCat]);

  // Lock background scroll while the mobile cart sheet is open.
  useEffect(() => {
    if (!cartOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [cartOpen]);

  const scrollToCat = (category: string) => {
    sectionRefs.current[category]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCheckout = () => {
    setCartOpen(false);
    if (belowMinimum) {
      setMinModalOpen(true);
      return;
    }
    router.push("/catering/checkout");
  };

  const breadcrumbs = useMemo(
    () =>
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Catering", path: "/catering" },
        { name: "Order", path: "/catering/order" },
      ]),
    []
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Order Catering — Halal Wings & Party Trays | Chick Rocks"
        description="Order Chick Rocks catering online — crispy halal fried chicken wings by the tray for parties, events, and gatherings in Astoria & Flushing, NY."
        path="/catering/order"
        keywords="halal catering queens, chicken wing tray catering, party catering astoria, chick rocks catering order"
        image={`${SITE.URL}/menu-images/chicken_wings_no_logo.png`}
        jsonLd={[breadcrumbs]}
      />

      <main className="flex-1 w-full">
        <div className="w-full">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] items-start">
            {/* Left — storefront, location, and menu (capped + centered so it
                doesn't stretch too wide on large screens) */}
            <div className="min-w-0 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-8">
              {/* Catering header image */}
              <div className="relative h-36 sm:h-44 md:h-52 w-full overflow-hidden rounded-2xl">
                <img
                  src="/catering-1.avif"
                  alt="Chick Rocks catering spread"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Location header — store switcher sits inline next to the address */}
              <div className="mt-3 sm:mt-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
                  Catering · Pickup
                </span>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <h1 className="font-heading uppercase tracking-wide text-3xl sm:text-4xl leading-[1] text-foreground">
                    Chick Rocks {store.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p className="text-sm text-muted-foreground">
                      {store.addressLine1}, {store.addressLine2}
                    </p>
                    <CateringStoreSelector value={storeId} onChange={setStoreId} />
                  </div>
                </div>
              </div>

              {/* Menu heading */}
              <h2 className="mt-4 sm:mt-5 text-lg sm:text-xl font-heading uppercase tracking-wide text-foreground">
                Catering Menu
              </h2>

              {/* Sticky category nav */}
              <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-10 mt-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
                <nav className="flex gap-1 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-10">
                  {CATEGORIES.map((category) => {
                    const isActive = activeCat === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        ref={(el) => {
                          navRefs.current[category] = el;
                        }}
                        onClick={() => scrollToCat(category)}
                        className={cn(
                          "relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {category}
                        <span
                          className={cn(
                            "absolute inset-x-3 -bottom-px h-0.5 rounded-full transition-colors",
                            isActive ? "bg-primary" : "bg-transparent"
                          )}
                        />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sections by category */}
              <div className="mt-6 space-y-10">
                {CATEGORIES.map((category) => {
                  const items = CATERING_PRODUCTS.filter((p) => p.category === category);
                  return (
                    <section
                      key={category}
                      id={catId(category)}
                      data-cat={category}
                      ref={(el) => {
                        sectionRefs.current[category] = el;
                      }}
                      className="scroll-mt-20"
                    >
                      <h3 className="mb-4 text-xl sm:text-2xl font-body font-bold uppercase tracking-tight text-foreground">
                        {category}
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                        {items.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            qty={cart[product.id] ?? 0}
                            onAdd={() => addItem(product.id)}
                            onSetQty={(q) => setQty(product.id, q)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>

              {/* Spacer so the fixed mobile "View Cart" bar doesn't cover the last items */}
              {itemCount > 0 && <div aria-hidden className="h-20 lg:hidden" />}
            </div>

            {/* Right — cart preview rail (desktop only; mobile uses the sheet below) */}
            <aside className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen flex-col border-l border-border">
              <CartContents onCheckout={handleCheckout} />
            </aside>
          </div>
        </div>
      </main>

      {/* Mobile: sticky "View Cart" bar */}
      {itemCount > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-gradient-to-t from-background via-background/95 to-transparent">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="w-full flex items-center justify-between gap-3 bg-primary text-primary-foreground rounded-full pl-5 pr-5 py-3.5 font-bold uppercase tracking-wide shadow-lg active:translate-y-px transition-transform"
          >
            <span className="inline-flex items-center gap-2">
              <span className="relative inline-flex">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full bg-primary-foreground text-primary text-[11px] leading-none tabular-nums">
                  {itemCount}
                </span>
              </span>
              View Cart
            </span>
            <span className="tabular-nums">{formatPrice(foodCents)}</span>
          </button>
        </div>
      )}

      {/* Mobile: cart bottom sheet */}
      {cartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-black/50 animate-in fade-in"
          />
          <div className="relative bg-card rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <CartContents onCheckout={handleCheckout} onClose={() => setCartOpen(false)} />
          </div>
        </div>
      )}

      <CateringOrderMinimumModal
        open={minModalOpen}
        onClose={() => setMinModalOpen(false)}
        minimumCents={ORDER_MINIMUM_CENTS}
        shortfallCents={shortfallCents}
      />
    </div>
  );
};

// Cart body — reused by the desktop rail and the mobile bottom sheet. Reads
// everything from the shared cart context; `onClose` (sheet only) renders a
// close button in the header.
type CartContentsProps = {
  onCheckout: () => void;
  onClose?: () => void;
};

const CartContents = ({ onCheckout, onClose }: CartContentsProps) => {
  const {
    store,
    lines,
    itemCount,
    selectedOptions,
    foodCents,
    taxCents,
    tipCents,
    totalCents,
    tipOption,
    customTip,
    setQty,
    setOption,
    setTipOption,
    setCustomTip,
  } = useCateringCart();

  return (
    <div className="bg-card flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border shrink-0">
        <ShoppingCart className="h-5 w-5 text-primary" />
        <h2 className="font-body font-bold uppercase tracking-tight text-foreground">Your Order</h2>
        {itemCount > 0 && (
          <span className="ml-auto text-sm font-bold text-muted-foreground tabular-nums">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className={cn(
              "h-8 w-8 inline-flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors",
              itemCount > 0 ? "ml-2" : "ml-auto"
            )}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="px-5 py-3 border-b border-border text-xs text-muted-foreground shrink-0">
        Pickup at{" "}
        <span className="font-semibold text-foreground">Chick Rocks {store.name}</span> ·{" "}
        {store.addressLine1}
      </div>

      {lines.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
          <Utensils className="h-10 w-10 mb-4 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground max-w-[15rem]">
            Your order is empty. Add items to get started.
          </p>
          <p className="mt-4 text-sm font-semibold text-foreground">$100 food &amp; beverage minimum</p>
          <p className="mt-6 text-xs text-muted-foreground">Powered by X.O. Continental</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
          <ul className="divide-y divide-border">
            {lines.map(({ product, qty, lineTotalCents }) => (
              <li key={product.id} className="px-5 py-4 flex gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug">{product.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatPrice(product.priceCents)} each
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Decrease ${product.name}`}
                      onClick={() => setQty(product.id, qty - 1)}
                      className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold tabular-nums">{qty}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${product.name}`}
                      onClick={() => setQty(product.id, qty + 1)}
                      className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${product.name}`}
                      onClick={() => setQty(product.id, 0)}
                      className="ml-1 h-7 w-7 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {product.options && product.options.length > 0 && (
                    <div className="mt-2.5">
                      <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        Choose flavor
                      </span>
                      <div className="inline-flex rounded-full border border-border p-0.5">
                        {product.options.map((opt) => {
                          const active = (selectedOptions[product.id] ?? product.options![0]) === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setOption(product.id, opt)}
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-semibold transition-colors",
                                active
                                  ? "bg-primary text-primary-foreground"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-sm font-bold text-foreground tabular-nums shrink-0">
                  {formatPrice(lineTotalCents)}
                </span>
              </li>
            ))}
          </ul>

          <div className="px-5 py-4 border-t border-border space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-foreground">
                <span>Food &amp; beverage</span>
                <span className="tabular-nums">{formatPrice(foodCents)}</span>
              </div>
              <div className="flex items-center justify-between text-foreground">
                <span>8.875% Sales tax</span>
                <span className="tabular-nums">{formatPrice(taxCents)}</span>
              </div>
              <div className="flex items-center justify-between text-foreground">
                <span>Tip</span>
                <span className="tabular-nums">{formatPrice(tipCents)}</span>
              </div>
            </div>

            {/* Tip selector — percentages are calculated on the pre-tax food total */}
            <div>
              <div className="grid grid-cols-4 gap-2">
                {TIP_CHOICES.map((choice) => (
                  <button
                    key={choice.key}
                    type="button"
                    onClick={() => setTipOption(choice.key)}
                    className={cn(
                      "py-2 rounded-full border text-sm font-semibold transition-colors",
                      tipOption === choice.key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:border-primary/50"
                    )}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
              {tipOption === "other" && (
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={customTip}
                    onChange={(e) => setCustomTip(e.target.value)}
                    placeholder="0.00"
                    aria-label="Custom tip amount"
                    className="w-full rounded-lg border border-border bg-background py-2 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3 text-base font-bold text-foreground">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(totalCents)}</span>
            </div>

            <p className="text-xs text-muted-foreground">Pickup only — no delivery fee.</p>

            <button
              type="button"
              onClick={onCheckout}
              className="w-full inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold uppercase tracking-wide hover:translate-y-[-1px] hover:shadow-lg transition-all duration-200"
            >
              Proceed to Checkout
            </button>

            <p className="pt-1 text-center text-xs text-muted-foreground">Powered by X.O. Continental</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Horizontal product card — text on the left, image + add control on the right.
type ProductCardProps = {
  product: (typeof CATERING_PRODUCTS)[number];
  qty: number;
  onAdd: () => void;
  onSetQty: (qty: number) => void;
};

const ProductCard = ({ product, qty, onAdd, onSetQty }: ProductCardProps) => (
  <article className="flex gap-4 rounded-2xl border border-border/70 bg-card p-4 sm:p-5 hover:shadow-md transition-shadow">
    <div className="flex flex-1 flex-col min-w-0">
      <h4 className="font-body text-[15px] sm:text-base font-bold leading-snug text-foreground">
        {product.name}
      </h4>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed text-pretty line-clamp-3">
        {product.description}
      </p>
      <div className="mt-auto pt-3 flex items-center gap-2 text-sm">
        <span className="font-heading text-base text-primary">{formatPrice(product.priceCents)}</span>
        <span aria-hidden className="text-border">|</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {product.category}
        </span>
      </div>
    </div>

    <div className="relative shrink-0 w-28 sm:w-36">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-cream">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={cn(
            "w-full h-full object-cover",
            !product.inStock && "opacity-50 grayscale"
          )}
        />
      </div>

      {!product.inStock ? (
        <span className="absolute top-2 left-2 bg-foreground/85 text-background text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
          Sold Out
        </span>
      ) : qty > 0 ? (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full border border-border bg-card px-1.5 py-1 shadow-md">
          <button
            type="button"
            aria-label={`Decrease ${product.name}`}
            onClick={() => onSetQty(qty - 1)}
            className="h-7 w-7 inline-flex items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-5 text-center text-sm font-bold tabular-nums">{qty}</span>
          <button
            type="button"
            aria-label={`Increase ${product.name}`}
            onClick={() => onSetQty(qty + 1)}
            className="h-7 w-7 inline-flex items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-label={`Add ${product.name}`}
          onClick={onAdd}
          className="absolute -bottom-3 -right-3 h-10 w-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground border-4 border-background shadow-md hover:translate-y-[-1px] hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
        </button>
      )}
    </div>
  </article>
);

export default CateringOrder;
