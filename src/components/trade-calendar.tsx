
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
  isToday as isTodayDateFns
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { DayLog } from "@/app/log-day/page";
import { useRouter } from "next/navigation";

interface DailyPnl {
  pnl: number;
  tradeCount: number;
}

export function TradeCalendar() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [today, setToday] = React.useState<Date | null>(null);
  const [dailyPnl, setDailyPnl] = React.useState<Record<string, DailyPnl>>({});

  React.useEffect(() => {
    setToday(new Date());

    const allLogsRaw = localStorage.getItem('all-trades');
    if (allLogsRaw) {
      const allLogs: DayLog[] = JSON.parse(allLogsRaw);
      const pnl: Record<string, DailyPnl> = {};
      allLogs.forEach((log) => {
        const logDate = new Date(log.date);
        const dayKey = format(logDate, "yyyy-MM-dd");
        if (!pnl[dayKey]) {
          pnl[dayKey] = { pnl: 0, tradeCount: 0 };
        }
        const dayPnl = log.trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
        pnl[dayKey].pnl += dayPnl;
        pnl[dayKey].tradeCount += log.trades.length;
      });
      setDailyPnl(pnl);
    }
  }, []);

  const firstDayOfCurrentMonth = startOfMonth(currentDate);

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayOfCurrentMonth, { weekStartsOn: 1 }), // Monday
    end: endOfWeek(endOfMonth(firstDayOfCurrentMonth), { weekStartsOn: 1 }),
  });

  function nextMonth() {
    setCurrentDate(add(currentDate, { months: 1 }));
  }

  function prevMonth() {
    setCurrentDate(sub(currentDate, { months: 1 }));
  }
  
  const isToday = (day: Date) => {
    if (!today) return false;
    return isTodayDateFns(day);
  }

  const handleDayClick = (day: Date) => {
    const dayKey = format(day, "yyyy-MM-dd");
    router.push(`/log-day?date=${dayKey}`);
  };


  return (
    <div className="p-4 h-full flex flex-col border border-border/20 rounded-lg">
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
      <div className="grid grid-cols-7 text-xs text-center font-semibold text-muted-foreground border-b border-border/20">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 gap-1 flex-1 pt-1">
        {days.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const pnlData = dailyPnl[dayKey];
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toString()}
              onClick={() => handleDayClick(day)}
              className={cn(
                "relative p-1 rounded-sm flex flex-col justify-center text-xs border cursor-pointer transition-colors",
                !isCurrentMonth && "bg-transparent text-muted-foreground/30 border-transparent hover:bg-accent/50",
                isCurrentMonth && !pnlData && "border-border/20 hover:bg-accent/50",
                pnlData && pnlData.pnl > 0 && "border-[hsl(var(--chart-1))] hover:bg-[hsl(var(--chart-1))]/10",
                pnlData && pnlData.pnl < 0 && "border-destructive hover:bg-destructive/10",
                pnlData && pnlData.pnl === 0 && "border-muted-foreground hover:bg-muted-foreground/10"
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
