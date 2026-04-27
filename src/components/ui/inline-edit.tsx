import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface InlineEditProps {
  id: string;
  isEditing: boolean;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  multiline?: boolean;
}

export const InlineEdit = ({
  id,
  isEditing,
  value,
  onChange,
  className,
  as: Component = "span",
  multiline = false,
}: InlineEditProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const handleBlur = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  if (!isEditing) {
    return <Component className={cn(className)} dangerouslySetInnerHTML={{ __html: value }} />;
  }

  return (
    <Component
      ref={ref as any}
      contentEditable
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      suppressContentEditableWarning
      className={cn(
        "outline-dashed outline-2 outline-yellow-400 outline-offset-2 transition-all",
        "bg-yellow-50/10 min-h-[1em] inline-block",
        className
      )}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};
