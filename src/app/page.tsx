
"use client";

import * as React from "react";
import {
  TrendingUp,
} from "lucide-react";

import { TradeCalendar } from "@/components/trade-calendar";
import { RecentTrades } from "@/components/recent-trades";
import { StatCard } from "@/components/stat-card";
import { MotivationCard } from "@/components/motivation-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            TradeLog
          </h1>
        </div>
        <Button asChild>
          <Link href="/log-day">Log Day</Link>
        </Button>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-hidden">
        <div className="mx-auto w-full max-w-7xl h-full flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1">
              <div className="lg:col-span-3 h-full">
                <TradeCalendar />
              </div>
              <div className="lg:col-span-2 h-full">
                <RecentTrades />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Win Rate" value="67%" />
                <StatCard title="Avg Win/Loss" value="2.1R" />
                <StatCard title="Progress On" value="100%" />
                <MotivationCard />
            </div>
        </div>
      </main>
    </div>
  );
}
