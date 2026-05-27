import { useEffect } from "react";
import { X } from "lucide-react";
import { formatPrice } from "@/lib/data/catering-products";

type Props = {
  open: boolean;
  onClose: () => void;
  minimumCents: number;
  shortfallCents: number;
};

const CateringOrderMinimumModal = ({ open, onClose, minimumCents, shortfallCents }: Props) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="catering-min-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-lg bg-background rounded-3xl shadow-2xl">
        <div className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 pb-2">
          <h2
            id="catering-min-modal-title"
            className="text-xl sm:text-2xl font-heading uppercase tracking-wide text-foreground"
          >
            Order Minimum Not Met
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 w-9 h-9 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 sm:px-8 pt-2 pb-6">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Chick Rocks catering has a{" "}
            <span className="font-bold text-foreground">{formatPrice(minimumCents)}</span> food and
            beverage minimum (before taxes, fees, and tip).
          </p>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Add <span className="font-bold text-foreground">{formatPrice(shortfallCents)}</span> of
            food or beverage to your cart to continue.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold uppercase tracking-wide hover:translate-y-[-1px] hover:shadow-lg transition-all duration-200"
          >
            Add More Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default CateringOrderMinimumModal;
