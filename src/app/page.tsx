"use client";

import * as React from "react";
import {
  TrendingUp,
} from "lucide-react";

import { AddTradeDialog } from "@/components/add-trade-dialog";
import { TradeCalendar } from "@/components/trade-calendar";
import { RecentTrades } from "@/components/recent-trades";
import { StatCard } from "@/components/stat-card";
import { MotivationCard } from "@/components/motivation-card";
import { TradepathScore } from "@/components/tradepath-score";
import { trades } from "@/lib/data";


export default function Home() {

  const totalTrades = trades.length;
  const winningTrades = trades.filter((trade) => trade.profitOrLoss > 0).length;
  const losingTrades = totalTrades - winningTrades;
  const tradeWinPercentage = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 0;
  
  const totalProfit = trades.filter((trade) => trade.profitOrLoss > 0).reduce((acc, trade) => acc + trade.profitOrLoss, 0);
  const totalLoss = trades.filter((trade) => trade.profitOrLoss < 0).reduce((acc, trade) => acc + trade.profitOrLoss, 0);

  const avgWin = winningTrades > 0 ? totalProfit / winningTrades : 0;
  const avgLoss = losingTrades > 0 ? Math.abs(totalLoss / losingTrades) : 0;
  const avgWinLoss = avgLoss > 0 ? Math.round((avgWin / avgLoss) * 100) / 100 : 0;

  const tradepathScore = Math.round((tradeWinPercentage * 0.4) + (avgWinLoss * 0.4) + (totalTrades * 0.2));


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

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto w-full max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3">
                <TradeCalendar />
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 gap-4">
                <RecentTrades />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard title="Win Rate" value={`${tradeWinPercentage}%`} />
                    <StatCard title="Avg Win/Loss" value={`${avgWinLoss.toFixed(2)}R`} />
                    <TradepathScore score={tradepathScore} />
                    <MotivationCard />
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
