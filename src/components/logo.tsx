
import * as React from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
    >
        {/* White Candle (background) */}
        <g transform="rotate(45 50 50)">
            <line x1="50" y1="10" x2="50" y2="90" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
            <rect x="40" y="25" width="20" height="50" fill="hsl(var(--card-foreground))" />
        </g>
        {/* Black Candle (foreground) */}
        <g transform="rotate(-45 50 50)">
            <line x1="50" y1="10" x2="50" y2="90" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
            <rect x="40" y="25" width="20" height="50" fill="hsl(var(--background))" stroke="hsl(var(--muted-foreground))" strokeWidth="1"/>
        </g>
    </svg>
  );
}
