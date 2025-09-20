
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
import Link from "next/link";

interface DailyPnl {
  pnl: number;
  tradeCount: number;
  isLogged: boolean;
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
            if (!log.date) return;
            const logDate = new Date(log.date);
            const dayKey = format(logDate, "yyyy-MM-dd");
            
            if (!pnl[dayKey]) {
              pnl[dayKey] = { pnl: 0, tradeCount: 0, isLogged: false };
            }

            const dayPnl = log.trades?.reduce((sum, trade) => sum + (trade.pnl || 0), 0) || 0;
            const hasImage = log.trades?.some(t => !!t.analysisImage);
            
            pnl[dayKey].pnl += dayPnl;
            pnl[dayKey].tradeCount += log.trades?.length || 0;
            
            pnl[dayKey].isLogged = dayPnl !== 0 || (hasImage && dayPnl === 0);
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

  const startOfCalendar = startOfWeek(firstDayOfCurrentMonth, { weekStartsOn: 0 });
  const endOfCalendar = endOfWeek(endOfMonth(firstDayOfCurrentMonth), { weekStartsOn: 0 });

  const days = eachDayOfInterval({
    start: startOfCalendar,
    end: endOfCalendar
  });

  const calendarWeeks = [];
  for (let i = 0; i < days.length; i += 7) {
    calendarWeeks.push(days.slice(i, i + 7));
  }

  if (calendarWeeks.length > 5) {
      const lastWeek = calendarWeeks[calendarWeeks.length - 1];
      if (lastWeek.every(day => !isSameMonth(day, currentDate))) {
        calendarWeeks.pop();
      }
  }
  const calendarDays = calendarWeeks.flat();


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
    <div className="border border-border">
      <div className="flex items-center justify-between p-2">
        <h2 className="text-lg font-bold font-headline">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
           <Button variant="outline" asChild>
                <Link href="/log-day">Log Day</Link>
           </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-t border-l border-border text-xs text-center font-semibold text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2 border-r border-b border-border">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-5 border-t-0 border-l border-border -mt-px">
        {calendarDays.map((day, index) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const pnlData = dailyPnl[dayKey];
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          let dayStyles: React.CSSProperties = {};
          let borderClasses = "border-r border-b border-border";

          if (pnlData?.isLogged) {
            let borderColor = 'hsl(var(--border))';
            if (pnlData.pnl > 0) borderColor = 'hsl(var(--chart-1))';
            else if (pnlData.pnl < 0) borderColor = 'hsl(var(--destructive))';
            else borderColor = 'hsl(var(--chart-3))';

            borderClasses = "";
            dayStyles = {
              boxShadow: `0 0 0 2px ${borderColor} inset`,
            };
          }


          return (
            <div
              key={day.toString()}
              onClick={() => isCurrentMonth && handleDayClick(day)}
              className={cn(
                "relative flex flex-col justify-center items-center text-xs transition-colors h-20 p-1",
                isCurrentMonth && "cursor-pointer",
                !isCurrentMonth && "text-muted-foreground/30",
                 pnlData?.isLogged ? "z-10" : "z-0",
                isCurrentMonth && !pnlData?.isLogged && "hover:bg-accent/50",
                borderClasses
              )}
              style={dayStyles}
            >
              <time
                  dateTime={format(day, "yyyy-MM-dd")}
                  className={cn(
                    "absolute top-1.5 left-1.5 font-semibold text-xs h-5 w-5 flex items-center justify-center",
                     isToday(day) && isCurrentMonth && "rounded-full bg-primary text-primary-foreground",
                     !isCurrentMonth && "text-muted-foreground/30"
                  )}
                >
                  {format(day, "d")}
                </time>

              {isCurrentMonth && pnlData?.isLogged ? (
                <div className="font-bold text-base p-1 text-center">
                  {pnlData.pnl !== 0 ? (
                    <span className={cn(pnlData.pnl > 0 && "text-[hsl(var(--chart-1))]", pnlData.pnl < 0 && "text-destructive")}>
                        {pnlData.pnl.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        })}
                    </span>
                  ) : (
                    <span className="font-medium text-sm text-[hsl(var(--chart-3))]">NO TRADE</span>
                  )}
                </div>
              ) : null}
              {isCurrentMonth && !pnlData?.isLogged ? <div className="h-full w-full"></div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
