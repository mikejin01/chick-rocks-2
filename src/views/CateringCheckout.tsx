"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import CateringStoreSelector from "@/components/CateringStoreSelector";
import Seo, { breadcrumbLd, SITE } from "@/components/Seo";
import { formatPrice } from "@/lib/data/catering-products";
import { formatHour, formatRange, getOpenStatus, getPickupSlots, mapEmbedUrl } from "@/lib/stores";
import {
  ORDER_MINIMUM_CENTS,
  TIP_CHOICES,
  useCateringCart,
} from "@/contexts/CateringCartContext";
import { cn } from "@/lib/utils";

// Local date (YYYY-MM-DD) for the native date input — built in local time so it
// matches the browser's calendar day, not UTC.
const toDateInputValue = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const formatPickupDate = (dateStr: string) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

type FormErrors = Partial<
  Record<"firstName" | "lastName" | "phone" | "email" | "date" | "time", string>
>;

const inputBase =
  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

const CateringCheckout = () => {
  const {
    hydrated,
    store,
    storeId,
    setStoreId,
    cart,
    selectedOptions,
    lines,
    itemCount,
    foodCents,
    taxCents,
    tipCents,
    totalCents,
    tipOption,
    customTip,
    setTipOption,
    setCustomTip,
    belowMinimum,
    shortfallCents,
  } = useCateringCart();

  // Client-only clock so the date defaults and slot filtering don't cause an
  // SSR/CSR hydration mismatch.
  const [now, setNow] = useState<Date | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const n = new Date();
    setNow(n);
    setDate(toDateInputValue(n));
  }, []);

  const slots = useMemo(
    () => (now ? getPickupSlots(store, date, now) : []),
    [now, store, date]
  );

  // Keep the selected time valid as the date/store (and thus slots) change.
  useEffect(() => {
    if (slots.length === 0) {
      setTime("");
      return;
    }
    setTime((prev) => (slots.some((s) => String(s.value) === prev) ? prev : String(slots[0].value)));
  }, [slots]);

  const minDate = now ? toDateInputValue(now) : undefined;
  const openStatus = now ? getOpenStatus(store.hours, now) : null;

  const breadcrumbs = useMemo(
    () =>
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Catering", path: "/catering" },
        { name: "Order", path: "/catering/order" },
        { name: "Checkout", path: "/catering/checkout" },
      ]),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const next: FormErrors = {};
    if (!firstName.trim()) next.firstName = "Required";
    if (!lastName.trim()) next.lastName = "Required";
    if (!/^[0-9+()\-.\s]{7,}$/.test(phone.trim())) next.phone = "Enter a valid phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email";
    if (!date) next.date = "Choose a pickup date";
    if (!time) next.time = "Choose a pickup time";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    if (belowMinimum) {
      toast.error(`Add ${formatPrice(shortfallCents)} more to meet the ${formatPrice(ORDER_MINIMUM_CENTS)} minimum.`);
      return;
    }

    // Hand off to the server, which recomputes the order from the catalog and
    // creates a Stripe Checkout Session, then redirect to Stripe-hosted payment.
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          cart,
          selectedOptions,
          tipOption,
          customTip,
          pickup: { date, time },
          customer: { firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim(), email: email.trim() },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        toast.error(data?.error ?? "Could not start payment. Please try again.");
        setSubmitting(false);
        return;
      }
      // Leaving the app for Stripe — keep `submitting` true so the button stays
      // disabled through the redirect.
      window.location.href = data.url;
    } catch {
      toast.error("Network error — please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Checkout — Catering Pickup | Chick Rocks"
        description="Review your Chick Rocks catering order, choose a pickup time, and enter your contact details."
        path="/catering/checkout"
        noIndex
        image={`${SITE.URL}/menu-images/chicken_wings_no_logo.png`}
        jsonLd={[breadcrumbs]}
      />

      {/* Slim top bar (no site nav — keeps the customer in the flow) */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 h-14 flex items-center gap-3">
          <Link
            href="/catering/order"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to order
          </Link>
          <span className="ml-auto text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Checkout
          </span>
        </div>
      </header>

      <main className="flex-1 w-full">
        {!hydrated ? (
          <div className="px-4 py-24 text-center text-sm text-muted-foreground">Loading your order…</div>
        ) : lines.length === 0 ? (
          <div className="px-4 py-24 flex flex-col items-center text-center">
            <ShoppingBag className="h-10 w-10 mb-4 text-muted-foreground/40" />
            <p className="text-base font-semibold text-foreground">Your order is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Add some items before checking out.</p>
            <Link
              href="/catering/order"
              className="mt-6 inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold uppercase tracking-wide hover:translate-y-[-1px] hover:shadow-lg transition-all duration-200"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] items-start">
            {/* Left — pickup + contact form */}
            <div className="min-w-0 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
              <h1 className="font-heading uppercase tracking-wide text-2xl sm:text-3xl text-foreground">
                Checkout
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Pickup only — choose a time during {store.name} store hours.
              </p>

              <form id="checkout-form" onSubmit={handleSubmit} className="mt-6 space-y-8" noValidate>
                {/* Pickup details */}
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
                    Pickup details
                  </h2>
                  <div className="mt-3 rounded-2xl border border-border bg-card">
                    {/* Map of the selected pickup location (rounded on the iframe so
                        the card doesn't need overflow-hidden, which would clip the
                        store dropdown) */}
                    <iframe
                      key={store.id}
                      title={`Map showing Chick Rocks ${store.name}`}
                      src={mapEmbedUrl(store)}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="block w-full h-48 sm:h-56 rounded-t-2xl border-0"
                    />

                    <div className="p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-base font-bold text-foreground">Chick Rocks {store.name}</p>
                          <a
                            href={`tel:${store.phone.replace(/[^0-9+]/g, "")}`}
                            className="mt-0.5 inline-block text-sm font-medium text-primary hover:underline"
                          >
                            {store.phone}
                          </a>
                          <p className="mt-1 text-sm text-muted-foreground leading-snug">
                            {store.addressLine1}
                            <br />
                            {store.addressLine2}
                          </p>
                          {openStatus && (
                            <p className="mt-1.5 text-sm">
                              <span
                                className={cn(
                                  "font-semibold",
                                  openStatus.open ? "text-green-600" : "text-muted-foreground"
                                )}
                              >
                                {openStatus.open ? "Open now" : "Closed"}
                              </span>
                              <span className="text-muted-foreground">
                                {" · "}
                                {openStatus.open
                                  ? formatRange(openStatus.activeHours)
                                  : `Opens ${formatHour(openStatus.nextHours.open)} ${openStatus.nextWhen}`}
                              </span>
                            </p>
                          )}
                        </div>
                        <CateringStoreSelector value={storeId} onChange={setStoreId} label="Change" align="right" />
                      </div>

                      <div className="mt-4 pt-4 border-t border-border grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="pickup-date"
                          className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                        >
                          Pickup date
                        </label>
                        <input
                          id="pickup-date"
                          type="date"
                          value={date}
                          min={minDate}
                          onChange={(e) => setDate(e.target.value)}
                          className={cn(inputBase, errors.date ? "border-destructive" : "border-border")}
                        />
                        {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date}</p>}
                      </div>

                      <div>
                        <label
                          htmlFor="pickup-time"
                          className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                        >
                          Pickup time
                        </label>
                        <select
                          id="pickup-time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          disabled={slots.length === 0}
                          className={cn(
                            inputBase,
                            "disabled:opacity-60",
                            errors.time ? "border-destructive" : "border-border"
                          )}
                        >
                          {slots.length === 0 ? (
                            <option value="">No times available</option>
                          ) : (
                            slots.map((s) => (
                              <option key={s.value} value={String(s.value)}>
                                {s.label}
                              </option>
                            ))
                          )}
                        </select>
                        {slots.length === 0 ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            No pickup times left for this date — please pick another day.
                          </p>
                        ) : (
                          errors.time && <p className="mt-1 text-xs text-destructive">{errors.time}</p>
                        )}
                      </div>
                    </div>
                    </div>
                  </div>
                </section>

                {/* Contact info */}
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
                    Your information
                  </h2>
                  <div className="mt-3 rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="first-name"
                          className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                        >
                          First name
                        </label>
                        <input
                          id="first-name"
                          type="text"
                          autoComplete="given-name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={cn(inputBase, errors.firstName ? "border-destructive" : "border-border")}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="last-name"
                          className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                        >
                          Last name
                        </label>
                        <input
                          id="last-name"
                          type="text"
                          autoComplete="family-name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={cn(inputBase, errors.lastName ? "border-destructive" : "border-border")}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                      >
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="(212) 555-0199"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={cn(inputBase, errors.phone ? "border-destructive" : "border-border")}
                      />
                      {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn(inputBase, errors.email ? "border-destructive" : "border-border")}
                      />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                </section>
              </form>
            </div>

            {/* Right — order summary */}
            <aside className="lg:sticky lg:top-0 lg:h-screen flex flex-col">
              <div className="bg-card border-t lg:border-t-0 lg:border-l border-border flex-1 flex flex-col min-h-0">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-border shrink-0">
                  <h2 className="font-body font-bold uppercase tracking-tight text-foreground">
                    Order Summary
                  </h2>
                  <span className="ml-auto text-sm font-bold text-muted-foreground tabular-nums">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="px-5 py-3 border-b border-border text-xs text-muted-foreground shrink-0">
                  Pickup at{" "}
                  <span className="font-semibold text-foreground">Chick Rocks {store.name}</span>
                  {date && time && (
                    <>
                      {" · "}
                      <span className="font-semibold text-foreground">
                        {formatPickupDate(date)} at {formatHour(Number(time))}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex-1 lg:overflow-y-auto flex flex-col min-h-0">
                  <ul className="divide-y divide-border">
                    {lines.map(({ product, qty, option, lineTotalCents }) => (
                      <li key={product.id} className="px-5 py-3 flex gap-3 text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground leading-snug">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Qty {qty}
                            {option ? ` · ${option}` : ""}
                          </p>
                        </div>
                        <span className="font-bold text-foreground tabular-nums shrink-0">
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

                    {belowMinimum && (
                      <p className="text-xs text-destructive">
                        Add {formatPrice(shortfallCents)} more to meet the{" "}
                        {formatPrice(ORDER_MINIMUM_CENTS)} minimum.{" "}
                        <Link href="/catering/order" className="underline font-semibold">
                          Add items
                        </Link>
                      </p>
                    )}

                    <button
                      type="submit"
                      form="checkout-form"
                      disabled={belowMinimum || submitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold uppercase tracking-wide hover:translate-y-[-1px] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Redirecting…
                        </>
                      ) : (
                        "Continue to Payment"
                      )}
                    </button>

                    <p className="pt-1 text-center text-xs text-muted-foreground">
                      You'll be redirected to Stripe for secure card payment.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default CateringCheckout;
