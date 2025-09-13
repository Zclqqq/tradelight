
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CircularProgress = ({
  progress,
  size = 120,
  strokeWidth = 10,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        className="text-muted/30"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="text-[hsl(var(--chart-1))] transition-all duration-300"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
};

export function ProgressCard() {
  const [progress, setProgress] = React.useState(20); // Example starting progress

  const handleLogDay = () => {
    // This would typically be tied to a successful day log action
    setProgress((prev) => Math.min(prev + 10, 100));
  };


  return (
    <Card className="h-full flex flex-col text-center">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="font-headline text-sm font-medium text-muted-foreground">
          Daily Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col items-center justify-center gap-2">
        <div className="relative flex items-center justify-center">
            <CircularProgress progress={progress} strokeWidth={12} size={100} />
            <Button 
                onClick={handleLogDay}
                className="absolute h-20 w-20 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-bold text-sm"
            >
                Log Day
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
