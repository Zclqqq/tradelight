
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

export const trades: Trade[] = [];

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
