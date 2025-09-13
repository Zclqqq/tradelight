
"use client";

import { trades } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

export function RecentTrades() {
    const recentTrades = trades;
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 flex-1 min-h-0">
        <ScrollArea className="h-full">
            <ul className="space-y-4 pr-4">
                {recentTrades.map(trade => (
                    <li key={trade.id} className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-10 text-center">
                                <p className="font-bold text-sm">{format(trade.date, "d")}</p>
                                <p className="text-xs text-muted-foreground">{format(trade.date, "MMM")}</p>
                            </div>
                            <p className="font-semibold text-sm w-16 truncate">{trade.instrument}</p>
                        </div>
                        <p className={cn("font-bold text-sm text-right min-w-[80px]", trade.profitOrLoss >= 0 ? "text-[hsl(var(--chart-1))]" : "text-[hsl(var(--chart-2))]")}>
                            {trade.profitOrLoss.toLocaleString("en-US", { style: "currency", currency: "USD"})}
                        </p>
                    </li>
                ))}
            </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
