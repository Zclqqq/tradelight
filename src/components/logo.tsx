
import * as React from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
    >
      <g transform="rotate(-45 50 50) translate(-10, -10)">
        <line
          x1="30"
          y1="10"
          x2="30"
          y2="90"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="2"
        />
        <rect
          x="20"
          y="25"
          width="20"
          height="50"
          fill="hsl(var(--destructive))"
        />
      </g>
      <g transform="rotate(45 50 50) translate(10, -10)">
        <line
          x1="70"
          y1="10"
          x2="70"
          y2="90"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="2"
        />
        <rect
          x="60"
          y="25"
          width="20"
          height="50"
          fill="hsl(var(--chart-1))"
        />
      </g>
    </svg>
  );
}
