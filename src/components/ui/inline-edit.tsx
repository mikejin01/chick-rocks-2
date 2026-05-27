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

export const InlineEdit = ({ className, value, as: Component = "span" }: InlineEditProps) => {
  return <Component className={cn(className)} dangerouslySetInnerHTML={{ __html: value }} />;
};
