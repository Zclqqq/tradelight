
"use client";

import * as React from "react";
import Link from "next/link";
import { CandlestickChart } from "lucide-react";

import { TradeCalendar } from "@/components/trade-calendar";
import { RecentTrades } from "@/components/recent-trades";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import type { DayLog } from "./log-day/page";

const quotes = [
    "The secret of getting ahead is getting started.",
    "It's not whether you get knocked down, it's whether you get up.",
    "The goal of a successful trader is to make the best trades. Money is secondary.",
    "The stock market is a device for transferring money from the impatient to the patient.",
    "In investing, what is comfortable is rarely profitable.",
    "I will not be a rock star. I will be a legend.",
    "The four most dangerous words in investing are: 'This time it's different.'",
    "Don't be afraid to take a big step. You can't cross a chasm in two small jumps."
];


export default function Home() {
  const [stats, setStats] = React.useState({
      netPnl: 0,
      avgWin: 0,
      winRate: 0,
  });
  const [quote, setQuote] = React.useState('');

  React.useEffect(() => {
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  React.useEffect(() => {
      const allLogsRaw = localStorage.getItem('all-trades');
      if (allLogsRaw) {
          const allLogs: DayLog[] = JSON.parse(allLogsRaw);
          const allTrades = allLogs.flatMap(log => log.trades.map(t => ({...t, date: new Date(log.date)})));

          const netPnl = allTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);
          const winningTrades = allTrades.filter(trade => (trade.pnl || 0) > 0);
          const avgWin = winningTrades.length > 0
            ? winningTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0) / winningTrades.length
            : 0;
          const winRate = allTrades.length > 0 ? (winningTrades.length / allTrades.length) * 100 : 0;
          
          setStats({ netPnl, avgWin, winRate });
      }
  }, []);

  return (
    <div className="flex flex-col h-screen text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 border-b border-border/20 bg-background/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-headline tracking-tighter">
              TradeLight
            </h1>
        </div>
        <p className="text-sm font-light text-muted-foreground italic hidden md:block">"{quote}"</p>
        <Button variant="outline" asChild>
          <Link href="/log-day">Log Day</Link>
        </Button>
      </header>

      <main className="flex-1 p-4 overflow-auto">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <TradeCalendar />
              </div>
              <div className="col-span-1">
                <RecentTrades />
              </div>
              <div className="col-span-1">
                <StatCard 
                    title="Net P&L" 
                    value={stats.netPnl.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0})} 
                />
              </div>
              <div className="col-span-1">
                <StatCard 
                    title="Avg Trade Win" 
                    value={stats.avgWin.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0})}
                  />
              </div>
              <div className="col-span-1">
                <StatCard 
                    title="Win Rate" 
                    value={`${stats.winRate.toFixed(0)}%`}
                  />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
