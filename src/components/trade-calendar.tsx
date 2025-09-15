
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
    const initializeCalendar = () => {
      setToday(new Date());
      
      const allLogsRaw = localStorage.getItem('all-trades');
      if (allLogsRaw) {
        try {
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
        } catch (error) {
          console.error("Failed to parse trade logs from localStorage", error);
          setDailyPnl({});
        }
      } else {
        setDailyPnl({});
      }
    };
    
    initializeCalendar();

    const handleStorageChange = () => {
        initializeCalendar();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also re-initialize when the component mounts, in case of navigation
    initializeCalendar();

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const firstDayOfCurrentMonth = startOfMonth(currentDate);

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayOfCurrentMonth, { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(firstDayOfCurrentMonth), { weekStartsOn: 0 }),
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
    <div className="flex flex-col">
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
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2 border-b border-r border-border/20 first:border-l">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-l border-border/20">
        {days.map((day, dayIdx) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const pnlData = dailyPnl[dayKey];
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toString()}
              onClick={() => isCurrentMonth && handleDayClick(day)}
              className={cn(
                "relative flex flex-col justify-start text-xs transition-colors border-b border-r border-border/20 p-1 h-20",
                isCurrentMonth && "cursor-pointer hover:bg-accent/50",
                !isCurrentMonth && "bg-transparent text-muted-foreground/30",
                isCurrentMonth && pnlData && pnlData.pnl > 0 && "bg-transparent hover:bg-transparent border-transparent shadow-[0_0_8px_0_hsl(var(--chart-1))] z-10",
                isCurrentMonth && pnlData && pnlData.pnl < 0 && "bg-destructive/10 hover:bg-destructive/20",
                isCurrentMonth && pnlData && pnlData.pnl === 0 && "hover:bg-muted-foreground/10"
              )}
            >
              {isCurrentMonth && (
                <>
                  <time
                    dateTime={format(day, "yyyy-MM-dd")}
                    className={cn(
                      "font-semibold text-[10px] ml-auto",
                      isToday(day) && "flex items-center justify-center h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px]"
                    )}
                  >
                    {format(day, "d")}
                  </time>

                  {pnlData ? (
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
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
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
