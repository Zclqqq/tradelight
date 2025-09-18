
import * as React from "react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn("transition-all duration-300 group group-hover:animate-glow", className)}
      fill="none"
      stroke="hsl(var(--foreground))"
      strokeWidth="3"
    >
      <path d="M50 5 L95 50 L50 95 L5 50 Z" />
      <path d="M50 15 L85 50 L50 85 L15 50 Z" />
    </svg>
  );
}
