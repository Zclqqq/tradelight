"use client";

import * as React from "react";
import {
  BookOpen,
  DollarSign,
  TrendingUp,
  Target,
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { trades, journalEntries } from "@/lib/data";
import { AddTradeDialog } from "@/components/add-trade-dialog";
import { TradepathScore } from "@/components/tradepath-score";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // --- Data Calculations ---
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.profitOrLoss > 0).length;
  const losingTrades = totalTrades - winningTrades;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  const totalProfit = trades
    .filter((t) => t.profitOrLoss > 0)
    .reduce((acc, t) => acc + t.profitOrLoss, 0);
  const totalLoss = trades
    .filter((t) => t.profitOrLoss < 0)
    .reduce((acc, t) => acc + t.profitOrLoss, 0);
  
  const netProfit = totalProfit + totalLoss;

  const avgWin = winningTrades > 0 ? totalProfit / winningTrades : 0;
  const avgLoss = losingTrades > 0 ? Math.abs(totalLoss) / losingTrades : 0;
  
  const profitFactor = totalLoss !== 0 ? totalProfit / Math.abs(totalLoss) : 0;

  const tradepathScore = Math.round(winRate * 0.5 + Math.min(profitFactor, 3) / 3 * 100 * 0.5);

  const emotionFrequency = trades.reduce((acc, trade) => {
    acc[trade.emotion] = (acc[trade.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageEmotion = Object.keys(emotionFrequency).length > 0 ? Object.entries(emotionFrequency).reduce((a, b) => (b[1] > a[1] ? b : a))[0] : "😐";

  const journalForSelectedDay = journalEntries.find(entry => 
    date && isSameDay(entry.date, date)
  );

  const tradesForSelectedDay = trades.filter(trade => 
    date && isSameDay(trade.date, date)
  );
  
  const daysWithActivity = React.useMemo(() => {
    const dates = new Set<string>();
    trades.forEach(t => dates.add(format(t.date, 'yyyy-MM-dd')));
    journalEntries.forEach(j => dates.add(format(j.date, 'yyyy-MM-dd')));
    return Array.from(dates).map(d => new Date(d));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            TradeLog
          </h1>
        </div>
        <AddTradeDialog />
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Column */}
          <div className="lg:col-span-2 grid gap-6">
            {/* Metric Cards */}
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net P&L</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={cn("text-2xl font-bold", netProfit >= 0 ? "text-primary" : "text-destructive")}>
                    {netProfit.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalTrades} total trades
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {winningTrades} won / {losingTrades} lost
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profitFactor.toFixed(2)}</div>
                   <p className="text-xs text-muted-foreground">
                    Avg Win: ${avgWin.toFixed(2)} / Avg Loss: ${avgLoss.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
                <TradepathScore score={tradepathScore} />
                <Card className="flex flex-col items-center justify-center">
                    <CardHeader>
                        <CardTitle className="text-center font-headline">Average Emotion</CardTitle>
                         <CardDescription className="text-center">Your dominant trading feeling</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center">
                        <span className="text-8xl">{averageEmotion}</span>
                    </CardContent>
                </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Instrument</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">P&L</TableHead>
                      <TableHead className="text-center">Emotion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.slice(0, 5).map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium">{trade.instrument}</TableCell>
                        <TableCell>{format(trade.date, "MMM d, yyyy")}</TableCell>
                        <TableCell className={cn("text-right font-semibold", trade.profitOrLoss > 0 ? "text-primary" : "text-destructive")}>
                          {trade.profitOrLoss > 0 ? "+" : ""}{trade.profitOrLoss.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </TableCell>
                        <TableCell className="text-center text-xl">{trade.emotion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 grid gap-6 auto-rows-min">
            <Card className="flex justify-center items-center p-2 sm:p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-0"
                modifiers={{ hasActivity: daysWithActivity }}
                modifiersStyles={{ hasActivity: { 
                  fontWeight: 'bold', 
                  color: 'hsl(var(--accent-foreground))', 
                  backgroundColor: 'hsl(var(--accent))' 
                  } 
                }}
              />
            </Card>

            <Card className="min-h-[200px]">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <BookOpen className="h-5 w-5"/>
                    <span>
                      {date ? format(date, "MMMM d, yyyy") : "Journal"}
                    </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {journalForSelectedDay ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground italic">"{journalForSelectedDay.content}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Overall Mood:</span>
                      <span className="text-2xl">{journalForSelectedDay.emotion}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No journal entry for this day.</p>
                )}
                 {tradesForSelectedDay.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-2">Trades on this day:</h4>
                    <ul className="space-y-1">
                      {tradesForSelectedDay.map(trade => (
                        <li key={trade.id} className="flex justify-between items-center text-sm">
                          <span>{trade.instrument}</span>
                           <span className={cn(trade.profitOrLoss > 0 ? "text-primary" : "text-destructive")}>
                            {trade.profitOrLoss.toFixed(2)}
                           </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                 )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
