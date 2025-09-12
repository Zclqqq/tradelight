"use client"

import { Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface TradepathScoreProps {
  score: number;
}

export function TradepathScore({ score }: TradepathScoreProps) {
  const chartData = [
    { name: "Score", value: score, fill: "hsl(var(--primary))" },
    { name: "Remaining", value: 100 - score, fill: "hsl(var(--muted))" },
  ];
  const chartConfig = {
    score: {
      label: "Score",
    },
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">Tradepath Score</CardTitle>
        <CardDescription>Your overall performance</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              startAngle={90}
              endAngle={450}
            >
                <Cell key="score" fill={chartData[0].fill} />
                <Cell key="remaining" fill={chartData[1].fill} />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center justify-center text-center">
            <div className="flex items-center gap-2 font-medium leading-none">
                <span className="text-3xl font-bold font-headline">{score}</span>
                <span className="text-muted-foreground text-lg">/ 100</span>
            </div>
        </div>
        <div className="leading-none text-muted-foreground text-center">
          Calculated based on win rate, risk management, and consistency.
        </div>
      </CardFooter>
    </Card>
  )
}
