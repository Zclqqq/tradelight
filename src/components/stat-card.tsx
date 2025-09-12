"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface StatCardProps {
    title: string;
    value?: string;
    children?: React.ReactNode;
}

export function StatCard({ title, value, children }: StatCardProps) {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="font-headline text-lg text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {value && <p className="text-4xl font-bold font-headline">{value}</p>}
        {children}
      </CardContent>
    </Card>
  )
}
