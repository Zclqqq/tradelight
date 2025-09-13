
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

export function ProgressCard() {
  const [goal, setGoal] = React.useState("Focus on discipline");
  const [isEditing, setIsEditing] = React.useState(false);
  const [progress, setProgress] = React.useState(33); // Example progress

  const handleGoalClick = () => {
    setIsEditing(true);
  };

  const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoal(event.target.value);
  };

  const handleGoalBlur = () => {
    setIsEditing(false);
  };

  const handleGoalKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
    }
  };

  const handleCheckIn = () => {
    setProgress((prev) => Math.min(prev + 10, 100));
  };


  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="font-headline text-sm font-medium text-muted-foreground">
          Progress On
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-between gap-2">
        {isEditing ? (
          <Input
            value={goal}
            onChange={handleGoalChange}
            onBlur={handleGoalBlur}
            onKeyDown={handleGoalKeyDown}
            className="text-base font-semibold h-auto p-0 bg-transparent border-0 focus-visible:ring-0"
            autoFocus
          />
        ) : (
          <p
            className="text-base font-semibold truncate cursor-pointer"
            onClick={handleGoalClick}
          >
            {goal}
          </p>
        )}
        <div className="flex items-center gap-3">
            <Button size="icon" className="rounded-full h-8 w-8 bg-green-500/20 hover:bg-green-500/30 text-green-400" onClick={handleCheckIn}>
                <Check className="h-5 w-5"/>
            </Button>
            <Progress value={progress} className="h-2 w-full"/>
        </div>
      </CardContent>
    </Card>
  );
}
