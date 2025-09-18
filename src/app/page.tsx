
"use client";

import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";

import { TradeCalendar } from "@/components/trade-calendar";
import { RecentTrades } from "@/components/recent-trades";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import type { DayLog } from "./log-day/page";
import { ProgressTracker } from "@/components/progress-tracker";

export default function Home() {
  const [stats, setStats] = React.useState({
      netPnl: 0,
      avgWin: 0,
      winRate: 0,
  });
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
        setIsClient(true);
  }, []);

  React.useEffect(() => {
      if (isClient) {
        const allLogsRaw = localStorage.getItem('all-trades');
        if (allLogsRaw) {
            try {
                const allLogs: DayLog[] = JSON.parse(allLogsRaw);
                const allTrades = allLogs.flatMap(log => log.trades.map(t => ({...t, date: new Date(log.date)})));

                const netPnl = allTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);
                const winningTrades = allTrades.filter(trade => (trade.pnl || 0) > 0);
                const avgWin = winningTrades.length > 0
                  ? winningTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0) / winningTrades.length
                  : 0;
                const winRate = allTrades.length > 0 ? (winningTrades.length / allTrades.length) * 100 : 0;
                
                setStats({ netPnl, avgWin, winRate });
            } catch (e) {
                console.error("Failed to parse trade logs", e);
            }
        }
      }
  }, [isClient]);

  return (
    <div className="flex flex-col h-screen text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 border-b border-border/20 bg-background/80 backdrop-blur-sm shrink-0">
        <div className="w-24"></div>
        <div className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-4">
            <div className="absolute inset-0 transition-all duration-300 ease-in-out group-hover:bg-white/10 group-hover:[mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_60%)]"></div>
            <span className="text-2xl font-bold font-headline tracking-widest">TRADE</span>
            <Logo className="h-8 w-8" />
            <span className="text-2xl font-bold font-headline tracking-widest">LIGHT</span>
        </div>
        <Button variant="outline" asChild>
          <Link href="/log-day">Log Day</Link>
        </Button>
      </header>

      <main className="flex-1 p-4 overflow-auto">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                {isClient && <TradeCalendar />}
              </div>
              <div className="md:col-span-1">
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
              <div className="col-span-1">
                <ProgressTracker />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
