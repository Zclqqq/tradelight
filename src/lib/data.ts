import { subDays } from "date-fns";

export type Emotion = '😊' | '😐' | '😟' | '😤' | '🤩';

export interface Trade {
  id: string;
  date: Date;
  instrument: string;
  profitOrLoss: number;
  notes: string;
  emotion: Emotion;
}

export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  emotion: Emotion;
}

const today = new Date();

export const trades: Trade[] = [
  {
    id: "1",
    date: subDays(today, 2),
    instrument: "AAPL",
    profitOrLoss: 250.75,
    notes: "Good entry based on moving average crossover.",
    emotion: "🤩",
  },
  {
    id: "2",
    date: subDays(today, 2),
    instrument: "TSLA",
    profitOrLoss: -120.50,
    notes: "Exited too late, should have stuck to stop-loss.",
    emotion: "😟",
  },
  {
    id: "3",
    date: subDays(today, 4),
    instrument: "NVDA",
    profitOrLoss: 450.00,
    notes: "Caught the breakout perfectly.",
    emotion: "🤩",
  },
  {
    id: "4",
    date: subDays(today, 5),
    instrument: "GOOGL",
    profitOrLoss: 180.25,
    notes: "Scalped for a small gain.",
    emotion: "😊",
  },
  {
    id: "5",
    date: subDays(today, 7),
    instrument: "MSFT",
    profitOrLoss: -75.00,
    notes: "Forced the trade, wasn't part of the plan.",
    emotion: "😤",
  },
    {
    id: "6",
    date: subDays(today, 8),
    instrument: "AMD",
    profitOrLoss: 310.00,
    notes: "Followed the trend, solid execution.",
    emotion: "😊",
  },
  {
    id: "7",
    date: subDays(today, 10),
    instrument: "AMZN",
    profitOrLoss: -200.00,
    notes: "Revenge trading after the MSFT loss.",
    emotion: "😤",
  },
];

export const journalEntries: JournalEntry[] = [
  {
    id: "j1",
    date: subDays(today, 2),
    content: "Felt a mix of emotions today. The high from the AAPL win was dampened by the TSLA loss. Need to work on not letting one bad trade affect my mindset.",
    emotion: "😐",
  },
  {
    id: "j2",
    date: subDays(today, 4),
    content: "Felt on top of the world with the NVDA trade. My analysis paid off and it feels great. Confidence is high.",
    emotion: "🤩",
  },
  {
    id: "j3",
    date: subDays(today, 7),
    content: "Frustrated with myself for the undisciplined trades. I know better than to force things. Taking a step back to review my rules.",
    emotion: "😤",
  },
    {
    id: "j4",
    date: today,
    content: "Market was choppy. Decided to sit on my hands and not force any trades. A day of no trades is better than a day of losses. Felt disciplined.",
    emotion: "😊",
  },
];
