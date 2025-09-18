
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

import { TradeCalendar } from "@/components/trade-calendar";
import { RecentTrades } from "@/components/recent-trades";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import type { DayLog } from "./log-day/page";
import { ProgressTracker } from "@/components/progress-tracker";
import { getTradeLogs, saveDayLog } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [allLogs, setAllLogs] = React.useState<DayLog[]>([]);
  const [stats, setStats] = React.useState({
      netPnl: 0,
      avgWin: 0,
      winRate: 0,
  });
  const [isClient, setIsClient] = React.useState(false);
  const [hasLocalData, setHasLocalData] = React.useState(false);

  React.useEffect(() => {
        setIsClient(true);
        // Check for old local storage data
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i)?.startsWith('trade-log-')) {
                setHasLocalData(true);
                break;
            }
        }
  }, []);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const fetchLogs = React.useCallback(async () => {
    if (isClient && user) {
        const logs = await getTradeLogs(user.uid);
        setAllLogs(logs);
    }
  }, [isClient, user]);

  React.useEffect(() => {
      fetchLogs();
  }, [fetchLogs]);

  React.useEffect(() => {
    if (allLogs.length > 0) {
        try {
            const allTrades = allLogs.flatMap(log => log.trades.map(t => ({...t, date: new Date(log.date)})));
            const tradesWithPnl = allTrades.filter(trade => trade.pnl !== 0);

            const netPnl = allTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);
            const winningTrades = allTrades.filter(trade => (trade.pnl || 0) > 0);
            const avgWin = winningTrades.length > 0
              ? winningTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0) / winningTrades.length
              : 0;
            const winRate = tradesWithPnl.length > 0 ? (winningTrades.length / tradesWithPnl.length) * 100 : 0;
            
            setStats({ netPnl, avgWin, winRate });
        } catch (e) {
            console.error("Failed to parse trade logs", e);
        }
    }
  }, [allLogs]);

  const handleMigrateData = async () => {
    if (!user) {
        toast({
            title: "Migration Failed",
            description: "You must be logged in to migrate data.",
            variant: "destructive"
        });
        return;
    }

    const keysToRemove: string[] = [];
    let migratedCount = 0;

    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('trade-log-')) {
                const item = localStorage.getItem(key);
                if (item) {
                    const dayLog = JSON.parse(item) as DayLog;
                    // Ensure date is a valid Date object before saving
                    dayLog.date = new Date(dayLog.date);
                    await saveDayLog(user.uid, dayLog);
                    keysToRemove.push(key);
                    migratedCount++;
                }
            }
        }

        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });

        toast({
            title: "Migration Complete!",
            description: `Successfully migrated ${migratedCount} day logs to your account.`,
        });
        setHasLocalData(false);
        // Refresh data from firestore
        fetchLogs();

    } catch (error) {
        console.error("Migration error:", error);
        toast({
            title: "Migration Failed",
            description: "An error occurred while migrating your data. Please try again.",
            variant: "destructive"
        });
    }
  };

  if (loading || !user) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 border-b border-border/20 bg-background/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-4">
             {hasLocalData && (
                <Button variant="secondary" onClick={handleMigrateData}>
                    Migrate Local Data
                </Button>
            )}
        </div>
        <div/>
        <Button variant="outline" asChild>
          <Link href="/log-day">Log Day</Link>
        </Button>
      </header>

      <main className="flex-1 p-4 overflow-auto">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                {isClient && <TradeCalendar logs={allLogs} />}
              </div>
              <div className="md:col-span-1">
                <RecentTrades logs={allLogs} />
              </div>
              <div className="col-span-1">
                <StatCard 
                    title="Net P&L" 
                    value={stats.netPnl.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0})} 
                />
              </div>
              <div className="col-span-1">
                <StatCard 
                    title="Avg Trade Win" 
                    value={stats.avgWin.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0})}
                  />
              </div>
              <div className="col-span-1">
                <StatCard 
                    title="Win Rate" 
                    value={`${stats.winRate.toFixed(0)}%`}
                  />
              </div>
              <div className="col-span-1">
                <ProgressTracker logs={allLogs} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
