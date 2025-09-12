"use client";

import * as React from "react";
import {
  TrendingUp,
  BookOpen,
  PlusCircle
} from "lucide-react";

import { AddTradeDialog } from "@/components/add-trade-dialog";
import { TradeCalendar } from "@/components/trade-calendar";
import { RecentTrades } from "@/components/recent-trades";
import { StatCard } from "@/components/stat-card";
import { MotivationCard } from "@/components/motivation-card";


export default function Home() {
  const tradeWinPercentage = 53;
  const avgWinLoss = 53;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            TradeLog
          </h1>
        </div>
        <AddTradeDialog />
      </header>

      <main className="flex-1 p-4">
        <div className="mx-auto w-full max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3">
                <TradeCalendar />
              </div>
              <div className="lg:col-span-2">
                <RecentTrades />
              </div>
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Trade Win" value={`${tradeWinPercentage}%`} />
                <StatCard title="Avg Win/Loss" value={`${avgWinLoss}%`} />
                <StatCard title="Progress On">
                    <ul className="text-xl font-bold font-headline text-center">
                        <li>X</li>
                        <li>Y</li>
                        <li>Z</li>
                    </ul>
                </StatCard>
                <MotivationCard />
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
