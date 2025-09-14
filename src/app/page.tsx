
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
import { ProgressCard } from "@/components/progress-card";
import { MotivationCard } from "@/components/motivation-card";


export default function Home() {

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 border-b bg-background/80 backdrop-blur-sm shrink-0">
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

      <main className="flex-1 p-6 overflow-auto">
        <div className="mx-auto w-full max-w-7xl h-full">
          <div className="grid grid-cols-4 grid-rows-3 gap-6 h-full">
            <div className="col-span-3 row-span-2">
              <TradeCalendar />
            </div>
            <div className="col-span-1 row-span-2">
              <RecentTrades />
            </div>
            <div className="col-span-1 row-span-1">
              <StatCard title="Trade Win %" value="53%" />
            </div>
            <div className="col-span-1 row-span-1">
              <StatCard title="Avg Win/Loss" value="$210" />
            </div>
            <div className="col-span-1 row-span-1">
              <ProgressCard />
            </div>
            <div className="col-span-1 row-span-1">
                <MotivationCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
