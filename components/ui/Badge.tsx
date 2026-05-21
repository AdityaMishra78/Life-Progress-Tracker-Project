import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "destructive";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variant === "default" && "bg-primary/10 text-primary",
        variant === "outline" && "border border-border text-muted",
        variant === "secondary" && "bg-card text-muted",
        variant === "destructive" && "bg-red-500/10 text-red-500",
        className
      )}
    >
      {children}
    </span>
  );
}
