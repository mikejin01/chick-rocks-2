import React, { useCallback } from "react";
import { Button } from "./button";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaEditProps {
  id: string;
  isEditing: boolean;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
  background?: boolean;
}

export const MediaEdit = ({
  id,
  isEditing,
  value,
  onChange,
  className,
  children,
  background = false,
}: MediaEditProps) => {
  const handleReplace = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!window.wp?.media) {
        alert("WordPress Media Library not loaded.");
        return;
      }
      const frame = window.wp.media({
        title: "Select or Upload Image",
        button: { text: "Use this image" },
        multiple: false,
      });
      frame.on("select", () => {
        const attachment = frame.state().get("selection").first().toJSON();
        onChange(attachment.url);
      });
      frame.open();
    },
    [onChange]
  );

  if (!isEditing) {
    return <div className={cn(className, "relative group")}>{children}</div>;
  }

  return (
    <div
      className={cn(className, "relative group", background ? "z-0" : "z-40")}
      style={background ? { pointerEvents: "none" } : {}}
    >
      {children}
      <div className="absolute inset-0 outline-dashed outline-2 outline-yellow-400 outline-offset-[-2px] z-30 pointer-events-none" />
      {background ? (
        <div className="absolute top-4 right-4 z-50 pointer-events-none">
          <Button
            size="sm"
            variant="secondary"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold pointer-events-auto shadow-xl border-2 border-white"
            onClick={handleReplace}
          >
            <ImageIcon className="w-4 h-4 mr-2" /> Replace Background
          </Button>
        </div>
      ) : (
        <div className="absolute inset-0 bg-yellow-400/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-40 pointer-events-none">
          <Button
            size="sm"
            variant="secondary"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold pointer-events-auto shadow-lg"
            onClick={handleReplace}
          >
            <ImageIcon className="w-4 h-4 mr-2" /> Replace Image
          </Button>
        </div>
      )}
    </div>
  );
};
