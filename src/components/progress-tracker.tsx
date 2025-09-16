
"use client";

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DayLog } from '@/app/log-day/page';

interface Goal {
    name: string;
    isCompleted: boolean;
    description: string;
    shortName: string;
}

export function ProgressTracker() {
    const [goals, setGoals] = React.useState<Goal[]>([]);

    React.useEffect(() => {
        const allLogsRaw = localStorage.getItem('all-trades');
        const allLogs: DayLog[] = allLogsRaw ? JSON.parse(allLogsRaw) : [];
        const allTrades = allLogs.flatMap(log => log.trades.map(t => ({...t, model: t.model || 'Default'})));

        // 1. Log 30 days
        const loggedDaysCount = new Set(allLogs.map(log => new Date(log.date).toDateString())).size;
        const log30Days = loggedDaysCount >= 30;

        // 2. Log 5 Trades
        const loggedTradesCount = allTrades.length;
        const log5Trades = loggedTradesCount >= 5;

        // 3. Profitable Model
        const models = new Map<string, { total: number, wins: number, pnl: number }>();
        allTrades.forEach(trade => {
            if (!trade.model) return;
            if (!models.has(trade.model)) {
                models.set(trade.model, { total: 0, wins: 0, pnl: 0 });
            }
            const modelData = models.get(trade.model)!;
            modelData.total += 1;
            modelData.pnl += trade.pnl;
            if (trade.pnl > 0) {
                modelData.wins += 1;
            }
        });
        
        let profitableModel = false;
        let bestWinRate = 0;
        for (const [_, data] of models.entries()) {
            if (data.total > 0) {
                const winRate = (data.wins / data.total) * 100;
                if(winRate > bestWinRate) bestWinRate = winRate;
                if (winRate > 55) {
                    profitableModel = true;
                }
            }
        }

        // 4. Pass Account ($3k profit with a model)
        let passAccount = false;
        let bestPnl = 0;
        for (const [_, data] of models.entries()) {
             if(data.pnl > bestPnl) bestPnl = data.pnl;
            if (data.pnl > 3000) {
                passAccount = true;
            }
        }
        
        const newGoals: Goal[] = [
            { name: "Log 30 Days", shortName: "Log 30 days", isCompleted: log30Days, description: `${loggedDaysCount} / 30 days logged.` },
            { name: "Log 5 Trades", shortName: "Log 5 trades", isCompleted: log5Trades, description: `${loggedTradesCount} / 5 trades logged.` },
            { name: "Profitable Model", shortName: "PF model", isCompleted: profitableModel, description: `Best model has a ${bestWinRate.toFixed(0)}% win rate.` },
            { name: "Pass Account", shortName: "Pass", isCompleted: passAccount, description: `Highest model profit is ${bestPnl.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0})}` }
        ];

        setGoals(newGoals);
    }, []);

    if (goals.length === 0) {
        return (
             <Card className="h-28 flex items-center justify-center">
                 <p className="text-muted-foreground">Loading Progress...</p>
             </Card>
        )
    }

    return (
        <Card className="h-28 flex items-center justify-center p-6">
            <div className="flex items-center w-full">
                {goals.map((goal, index) => (
                    <React.Fragment key={goal.name}>
                        <span className={cn(
                            "text-sm font-medium",
                            goal.isCompleted ? "text-primary" : "text-muted-foreground/60"
                        )}>
                            {goal.shortName}
                        </span>
                        {index < goals.length - 1 && (
                             <div className={cn(
                                "flex-1 h-px mx-4",
                                goal.isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                            )} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </Card>
    );
}
