
import * as React from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
    >
      <style>
        {`
          .candle-wick { stroke: hsl(var(--muted-foreground)); stroke-width: 2; }
          .candle-bg-body { fill: hsl(var(--card-foreground)); }
          .candle-fg-body {
            fill: hsl(var(--background));
            stroke: hsl(var(--muted-foreground));
            stroke-width: 1;
            transition: fill 0.2s ease-in-out;
          }
          svg:hover .candle-fg-body {
            fill: hsl(var(--card-foreground));
          }
        `}
      </style>
      {/* Background Candle */}
      <g transform="rotate(45 50 50)">
        <line className="candle-wick" x1="50" y1="10" x2="50" y2="90" />
        <rect className="candle-bg-body" x="35" y="20" width="30" height="60" rx="2" />
      </g>
      {/* Foreground Candle */}
      <g transform="rotate(-45 50 50)">
        <line className="candle-wick" x1="50" y1="10" x2="50" y2="90" />
        <rect className="candle-fg-body" x="35" y="20" width="30" height="60" rx="2" />
      </g>
    </svg>
  );
}
