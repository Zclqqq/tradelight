"use client";

import * as React from "react";
import {
  TrendingUp,
} from "lucide-react";

import { AddTradeDialog } from "@/components/add-trade-dialog";
import { TradeCalendar } from "@/components/trade-calendar";


export default function Home() {
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

      <main className="flex-1 p-4 md:p-8">
        <TradeCalendar />
      </main>
    </div>
  );
}
