
"use client";

import * as React from "react";
import {
  TrendingUp,
} from "lucide-react";

import { TradeCalendar } from "@/components/trade-calendar";
import { RecentTrades } from "@/components/recent-trades";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MotivationCard } from "@/components/motivation-card";
import { trades } from "@/lib/data";


export default function Home() {
  const netPnl = trades.reduce((acc, trade) => acc + trade.profitOrLoss, 0);
  const winningTrades = trades.filter(trade => trade.profitOrLoss > 0);
  const avgWin = winningTrades.length > 0
    ? winningTrades.reduce((acc, trade) => acc + trade.profitOrLoss, 0) / winningTrades.length
    : 0;

  const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 border-b border-border/20 bg-background/80 backdrop-blur-sm shrink-0">
        <h1 className="text-xl font-bold font-headline">
          TradeLight
        </h1>
        <Button variant="outline" asChild>
          <Link href="/log-day">Log Day</Link>
        </Button>
      </header>

      <main className="flex-1 p-4 overflow-auto">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 row-span-2">
              <TradeCalendar />
            </div>
            <div className="col-span-1 row-span-2">
              <RecentTrades />
            </div>
            <div className="col-span-1">
               <StatCard 
                  title="Net P&L" 
                  value={netPnl.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0})} 
               />
            </div>
             <div className="col-span-1">
               <StatCard 
                  title="Avg Trade Win" 
                  value={avgWin.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0})}
                />
            </div>
            <div className="col-span-1">
               <StatCard 
                  title="Win Rate" 
                  value={`${winRate.toFixed(0)}%`}
                />
            </div>
            <div className="col-span-1">
                <MotivationCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
