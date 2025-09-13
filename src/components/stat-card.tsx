"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface StatCardProps {
    title: string;
    value?: string;
    children?: React.ReactNode;
}

export function StatCard({ title, value, children }: StatCardProps) {
  return (
    <Card className="text-center h-full">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="font-headline text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {value && <p className="text-3xl font-bold font-headline">{value}</p>}
        {children}
      </CardContent>
    </Card>
  )
}
