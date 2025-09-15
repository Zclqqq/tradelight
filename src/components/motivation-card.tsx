
"use client";

import * as React from 'react';
import { Card, CardContent } from './ui/card';

const quotes = [
    "The secret of getting ahead is getting started.",
    "It's not whether you get knocked down, it's whether you get up.",
    "The goal of a successful trader is to make the best trades. Money is secondary.",
    "The stock market is a device for transferring money from the impatient to the patient.",
    "In investing, what is comfortable is rarely profitable.",
    "I will not be a rock star. I will be a legend.",
    "The four most dangerous words in investing are: 'This time it's different.'",
    "Don't be afraid to take a big step. You can't cross a chasm in two small jumps."
];


export function MotivationCard() {
    const [quote, setQuote] = React.useState('');

    React.useEffect(() => {
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

  return (
    <Card className="h-full min-h-[120px]">
        <CardContent className="text-center flex flex-col items-center justify-center h-full p-4">
            <p className="text-sm font-medium text-muted-foreground italic">"{quote}"</p>
        </CardContent>
    </Card>
  );
}
