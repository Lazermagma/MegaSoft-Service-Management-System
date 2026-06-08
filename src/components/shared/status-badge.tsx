import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  label: string;
  variant?: "default" | "secondary" | "outline" | "destructive";
  className?: string;
};

export function StatusBadge({
  label,
  variant = "secondary",
  className,
}: StatusBadgeProps) {
  return (
    <Badge variant={variant} className={cn(className)}>
      {label}
    </Badge>
  );
}
