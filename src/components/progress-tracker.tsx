
"use client";

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import type { DayLog } from '@/app/log-day/page';

interface Goal {
    name: string;
    isCompleted: boolean;
    description: string;
}

const goalsConfig = [
    { name: "Log 30 Days", key: "log30Days" },
    { name: "Log 5 Trades", key: "log5Trades" },
    { name: "Profitable Model", key: "profitableModel" },
    { name: "Pass Account", key: "passAccount" },
];

export function ProgressTracker() {
    const [goals, setGoals] = React.useState<Goal[]>([]);
    const [progress, setProgress] = React.useState(0);

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
            { name: "Log 30 Days", isCompleted: log30Days, description: `${loggedDaysCount} / 30 Days` },
            { name: "Log 5 Trades", isCompleted: log5Trades, description: `${loggedTradesCount} / 5 Trades` },
            { name: "Profitable Model", isCompleted: profitableModel, description: `Best: ${bestWinRate.toFixed(0)}% Win Rate` },
            { name: "Pass Account", isCompleted: passAccount, description: `Top P&L: ${bestPnl.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0})}` }
        ];

        setGoals(newGoals);
        const completedGoals = newGoals.filter(g => g.isCompleted).length;
        setProgress((completedGoals / newGoals.length) * 100);

    }, []);

    const StatusIcon = ({ isCompleted }: { isCompleted: boolean }) => {
        if (isCompleted) {
            return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        }
        return <Circle className="h-4 w-4 text-muted-foreground/50" />;
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Road to Funded</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Progress value={progress} indicatorClassName={progress === 100 ? "bg-green-500" : ""} />
                    <ul className="space-y-3 text-sm">
                        {goals.map(goal => (
                            <li key={goal.name} className="flex items-start gap-3">
                                <StatusIcon isCompleted={goal.isCompleted} />
                                <div className='flex flex-col -mt-0.5'>
                                  <span className="font-medium">{goal.name}</span>
                                  <span className="text-xs text-muted-foreground">{goal.description}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
