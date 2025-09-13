"use client";

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const quotes = [
    "The secret to getting ahead is getting started.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Don't watch the clock; do what it does. Keep going.",
    "It does not matter how slowly you go as long as you do not stop.",
    "The best way to predict the future is to create it."
];


export function MotivationCard() {
    const [quote, setQuote] = React.useState('');

    React.useEffect(() => {
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

  return (
    <Card className="text-center h-full flex flex-col">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="font-headline text-sm font-medium text-muted-foreground">Motivation Quote</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex items-center justify-center">
        <p className="text-sm font-medium">"{quote}"</p>
      </CardContent>
    </Card>
  );
}
