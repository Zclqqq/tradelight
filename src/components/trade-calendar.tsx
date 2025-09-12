
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
    start: startOfWeek(firstDayOfCurrentMonth, { weekStartsOn: 0 }), // Sunday
    end: endOfWeek(endOfMonth(firstDayOfCurrentMonth), { weekStartsOn: 0 }),
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
    <div className="bg-card p-4 rounded-lg shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold font-headline">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px text-xs border-t border-l border-border bg-border">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-1 text-xs font-semibold text-center bg-card text-muted-foreground">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const pnlData = dailyPnl[dayKey];
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toString()}
              className={cn(
                "relative bg-card p-1 h-16 flex flex-col justify-start text-xs",
                !isCurrentMonth && "bg-muted/50 text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "font-semibold self-end",
                   isToday(day) && "flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs"
                )}
              >
                {format(day, "d")}
              </div>

              {pnlData && isCurrentMonth ? (
                <div
                  className={cn(
                    "font-bold text-xs mt-1",
                    pnlData.pnl > 0 && "text-green-400",
                    pnlData.pnl < 0 && "text-red-400"
                  )}
                >
                  {pnlData.pnl.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
