import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "destructive";
}

export function Badge({
  children,
  variant = "default",
  className,
  ...props
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
      {...props}
    >
      {children}
    </span>
  );
}
