
import * as React from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="hsl(var(--foreground))"
      strokeWidth="2"
    >
      <g transform="rotate(45 50 50)">
        <line x1="50" y1="10" x2="50" y2="25" />
        <line x1="50" y1="75" x2="50" y2="90" />
        <rect x="40" y="25" width="20" height="50" rx="1" />
      </g>
      <g transform="rotate(-45 50 50)">
        <line x1="50" y1="10" x2="50" y2="25" />
        <line x1="50" y1="75" x2="50" y2="90" />
        <rect x="40" y="25" width="20" height="50" rx="1" />
      </g>
    </svg>
  );
}
