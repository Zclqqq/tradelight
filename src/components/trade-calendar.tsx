
"use client";

import * as React from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  add,
  sub,
  isToday
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trades } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DailyPnl {
  pnl: number;
  tradeCount: number;
}

export function TradeCalendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const firstDayOfCurrentMonth = startOfMonth(currentDate);

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayOfCurrentMonth, { weekStartsOn: 1 }), // Monday
    end: endOfWeek(endOfMonth(firstDayOfCurrentMonth), { weekStartsOn: 1 }),
  });

  const dailyPnl: Record<string, DailyPnl> = React.useMemo(() => {
    const pnl: Record<string, DailyPnl> = {};
    trades.forEach((trade) => {
      const dayKey = format(trade.date, "yyyy-MM-dd");
      if (!pnl[dayKey]) {
        pnl[dayKey] = { pnl: 0, tradeCount: 0 };
      }
      pnl[dayKey].pnl += trade.profitOrLoss;
      pnl[dayKey].tradeCount++;
    });
    return pnl;
  }, []);

  function nextMonth() {
    setCurrentDate(add(currentDate, { months: 1 }));
  }

  function prevMonth() {
    setCurrentDate(sub(currentDate, { months: 1 }));
  }

  return (
    <div className="p-4 h-full flex flex-col border">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold font-headline">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-xs text-center font-semibold text-muted-foreground">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-5 gap-1 flex-1">
        {days.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const pnlData = dailyPnl[dayKey];
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toString()}
              className={cn(
                "relative p-1 rounded-sm flex flex-col justify-center text-xs border",
                !isCurrentMonth && "bg-muted/5 text-muted-foreground/50 border-transparent",
                isCurrentMonth && !pnlData && "border-border/50",
                pnlData && pnlData.pnl > 0 && "border-[hsl(var(--chart-1))]",
                pnlData && pnlData.pnl < 0 && "border-destructive",
                pnlData && pnlData.pnl === 0 && "border-muted-foreground"
              )}
            >
              <time
                dateTime={format(day, "yyyy-MM-dd")}
                className={cn(
                  "absolute top-1 right-1 font-semibold text-[10px]",
                   isToday(day) && "flex items-center justify-center h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px]"
                )}
              >
                {format(day, "d")}
              </time>

              {pnlData && isCurrentMonth ? (
                <div className="flex-1 flex items-center justify-center font-bold text-sm">
                  {pnlData.pnl !== 0 ? (
                    <span className={cn(pnlData.pnl > 0 && "text-[hsl(var(--chart-1))]", pnlData.pnl < 0 && "text-destructive")}>
                        {pnlData.pnl.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        })}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-[10px]">No Trade</span>
                  )}
                </div>
              ) : isCurrentMonth ? (
                 <div className="flex-1 flex items-center justify-center">
                </div>
              ): null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
