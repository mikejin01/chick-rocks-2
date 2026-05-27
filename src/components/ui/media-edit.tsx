import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MediaEditProps {
  id: string;
  isEditing: boolean;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  children: ReactNode;
  background?: boolean;
}

export const MediaEdit = ({ className, children }: MediaEditProps) => {
  return <div className={cn(className, "relative")}>{children}</div>;
};
