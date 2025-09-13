"use client";

import { trades } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function RecentTrades() {
    const recentTrades = trades.slice(0, 5);
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Recent Trade List</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="space-y-3">
            {recentTrades.map(trade => (
                <li key={trade.id} className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-sm">{trade.instrument}</p>
                        <p className="text-xs text-muted-foreground">{format(trade.date, "MMM d")}</p>
                    </div>
                    <p className={cn("font-bold text-sm", trade.profitOrLoss > 0 ? "text-green-400" : "text-red-400")}>
                        {trade.profitOrLoss.toLocaleString("en-US", { style: "currency", currency: "USD"})}
                    </p>
                </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
}
