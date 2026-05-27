"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Seo, { SITE } from "@/components/Seo";
import { formatPrice } from "@/lib/data/catering-products";
import { useCateringCart } from "@/contexts/CateringCartContext";
import { STORES } from "@/lib/stores";

type SessionInfo = {
  paid: boolean;
  amountTotal: number | null;
  customerEmail: string | null;
  storeId: string | null;
  pickup: string | null;
};

type State =
  | { status: "loading" }
  | { status: "success"; info: SessionInfo }
  | { status: "error"; message: string };

const CateringConfirmation = () => {
  const { clearCart } = useCateringCart();
  const [state, setState] = useState<State>({ status: "loading" });
  // Guard the one-time cart clear against React 18/19 StrictMode double-effects.
  const cleared = useRef(false);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      setState({ status: "error", message: "We couldn't find your order reference." });
      return;
    }

    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/checkout/session?id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (!active) return;
        if (!res.ok) {
          setState({ status: "error", message: data?.error ?? "Could not load your order." });
          return;
        }
        if (data.paid) {
          if (!cleared.current) {
            cleared.current = true;
            clearCart();
          }
          setState({ status: "success", info: data as SessionInfo });
        } else {
          setState({
            status: "error",
            message: "Your payment hasn't completed yet. If you were charged, it will appear shortly.",
          });
        }
      } catch {
        if (active) setState({ status: "error", message: "Could not load your order." });
      }
    })();

    return () => {
      active = false;
    };
  }, [clearCart]);

  const storeName =
    state.status === "success"
      ? STORES.find((s) => s.id === state.info.storeId)?.name ?? null
      : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Order Confirmed | Chick Rocks Catering"
        description="Your Chick Rocks catering order is confirmed."
        path="/catering/confirmation"
        noIndex
        image={`${SITE.URL}/menu-images/chicken_wings_no_logo.png`}
      />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          {state.status === "loading" && (
            <>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Confirming your order…</p>
            </>
          )}

          {state.status === "success" && (
            <>
              <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
              <h1 className="mt-4 font-heading uppercase tracking-wide text-3xl text-foreground">
                Order confirmed!
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Thanks for your order. A receipt is on its way
                {state.info.customerEmail ? (
                  <>
                    {" "}
                    to <span className="font-semibold text-foreground">{state.info.customerEmail}</span>
                  </>
                ) : null}
                .
              </p>

              <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-left text-sm space-y-2">
                {storeName && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pickup location</span>
                    <span className="font-semibold text-foreground">Chick Rocks {storeName}</span>
                  </div>
                )}
                {state.info.pickup && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pickup time</span>
                    <span className="font-semibold text-foreground">{state.info.pickup}</span>
                  </div>
                )}
                {typeof state.info.amountTotal === "number" && (
                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">Total paid</span>
                    <span className="font-bold text-foreground tabular-nums">
                      {formatPrice(state.info.amountTotal)}
                    </span>
                  </div>
                )}
              </div>

              <Link
                href="/"
                className="mt-6 inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold uppercase tracking-wide hover:translate-y-[-1px] hover:shadow-lg transition-all duration-200"
              >
                Back to home
              </Link>
            </>
          )}

          {state.status === "error" && (
            <>
              <XCircle className="mx-auto h-14 w-14 text-destructive" />
              <h1 className="mt-4 font-heading uppercase tracking-wide text-2xl text-foreground">
                Something went wrong
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
              <Link
                href="/catering/order"
                className="mt-6 inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold uppercase tracking-wide hover:translate-y-[-1px] hover:shadow-lg transition-all duration-200"
              >
                Back to your order
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CateringConfirmation;
