"use client";

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const quotes = [
    "The goal of a successful trader is to make the best trades. Money is secondary.",
    "The four most dangerous words in investing are: 'This time it's different.'",
    "In investing, what is comfortable is rarely profitable.",
    "The stock market is a device for transferring money from the impatient to the patient.",
    "An investment in knowledge pays the best interest."
];

export function MotivationCard() {
    const [quote, setQuote] = React.useState('');

    React.useEffect(() => {
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

  return (
    <Card className="text-center">
      <CardHeader className="p-4">
        <CardTitle className="font-headline text-base text-muted-foreground">Motivation Quote</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xs font-medium">"{quote}"</p>
      </CardContent>
    </Card>
  );
}
