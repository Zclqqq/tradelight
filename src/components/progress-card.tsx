
"use client";

import * as React from "react";
import { Check, Edit, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { MotivationCard } from "./motivation-card";

const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

type Goal = {
  id: number;
  title: string;
  progress: number;
  lastCompleted: Date | null;
};

const initialGoals: Goal[] = [
    { id: 1, title: 'Review Trades', progress: 4, lastCompleted: new Date('2024-07-20T10:00:00Z') },
    { id: 2, title: 'Journaling', progress: 5, lastCompleted: new Date('2024-07-21T10:00:00Z') },
    { id: 3, title: 'Backtesting', progress: 2, lastCompleted: new Date('2024-07-18T10:00:00Z') },
];

const GoalTracker = ({ goal, onUpdate, onComplete }: { goal: Goal, onUpdate: (id: number, title: string) => void, onComplete: (id: number) => void }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [title, setTitle] = React.useState(goal.title);

    const today = new Date();
    const canComplete = !goal.lastCompleted || !isSameDay(goal.lastCompleted, today);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleSave = () => {
        onUpdate(goal.id, title);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <div className="flex items-center gap-2 py-1">
            <div className="flex-1 flex items-center gap-2">
                {isEditing ? (
                    <Input 
                        value={title} 
                        onChange={handleTitleChange} 
                        onBlur={handleSave} 
                        onKeyDown={handleKeyDown}
                        className="h-7 text-xs" 
                    />
                ) : (
                    <span className="font-medium text-xs flex-1 truncate">{goal.title}</span>
                )}
                 <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="h-3 w-3" />
                </Button>
            </div>
            <div className="flex items-center gap-2 w-28">
                <Progress value={(goal.progress / 7) * 100} className="h-1.5 w-full" indicatorClassName="bg-[hsl(var(--chart-1))]" />
                <span className="text-xs font-mono w-8 text-right">{goal.progress}/7</span>
            </div>
            <Button 
                size="sm" 
                variant={canComplete ? "default" : "secondary"}
                onClick={() => canComplete && onComplete(goal.id)}
                className="w-20 h-7 text-xs gap-1"
                disabled={!canComplete}
            >
                {canComplete ? <Plus className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                <span>{canComplete ? 'Done' : 'Done'}</span>
            </Button>
        </div>
    );
};

export function ProgressCard() {
  const [goals, setGoals] = React.useState<Goal[]>(initialGoals);

  const handleUpdateGoal = (id: number, title: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, title } : g));
  };

  const handleCompleteGoal = (id: number) => {
    setGoals(goals.map(g => {
        if (g.id === id) {
            const today = new Date();
            const canComplete = !g.lastCompleted || !isSameDay(g.lastCompleted, today);
            if(canComplete) {
                return { ...g, progress: Math.min(g.progress + 1, 7), lastCompleted: today };
            }
        }
        return g;
    }));
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="font-headline text-sm font-medium text-muted-foreground">
          Weekly Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 grid grid-cols-2 gap-4 items-center">
        <div className="flex flex-col justify-center gap-1">
            {goals.map(goal => (
                <GoalTracker 
                    key={goal.id} 
                    goal={goal} 
                    onUpdate={handleUpdateGoal} 
                    onComplete={handleCompleteGoal}
                />
            ))}
        </div>
        <div className="border-l border-border h-2/3" />
        <MotivationCard />
      </CardContent>
    </Card>
  );
}
