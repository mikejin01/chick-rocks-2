"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { STORES, type Store } from "@/lib/stores";
import { cn } from "@/lib/utils";

type Props = {
  value: Store["id"];
  onChange: (id: Store["id"]) => void;
  label?: string;
  align?: "left" | "right"; // which edge the dropdown aligns to / opens from
  className?: string;
};

// Pickup-location switcher (Astoria vs Flushing). Shared by the order and
// checkout pages.
const CateringStoreSelector = ({
  value,
  onChange,
  label = "Change location",
  align = "left",
  className,
}: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-semibold text-foreground hover:border-primary/50 transition-colors"
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute z-40 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-1.5 shadow-xl",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {STORES.map((s) => {
            const selected = s.id === value;
            return (
              <button
                key={s.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(s.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-start gap-2 rounded-xl px-3 py-2.5 text-left transition-colors",
                  selected ? "bg-primary/10" : "hover:bg-muted"
                )}
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold text-foreground">Chick Rocks {s.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {s.addressLine1}, {s.addressLine2}
                  </span>
                </span>
                {selected && <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CateringStoreSelector;
