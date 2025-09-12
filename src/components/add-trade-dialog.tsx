"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emotions = ['🤩', '😊', '😐', '😟', '😤'] as const;

const tradeFormSchema = z.object({
  instrument: z.string().min(1, "Instrument is required."),
  profitOrLoss: z.coerce.number(),
  notes: z.string().optional(),
  emotion: z.enum(emotions),
});

const journalFormSchema = z.object({
  content: z.string().min(10, "Journal entry must be at least 10 characters."),
  emotion: z.enum(emotions),
});

export function AddTradeDialog() {
  const { toast } = useToast();

  const tradeForm = useForm<z.infer<typeof tradeFormSchema>>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      instrument: "",
      profitOrLoss: 0,
      notes: "",
      emotion: '😐',
    },
  });

  const journalForm = useForm<z.infer<typeof journalFormSchema>>({
    resolver: zodResolver(journalFormSchema),
    defaultValues: {
      content: "",
      emotion: '😐',
    },
  });

  function onTradeSubmit(values: z.infer<typeof tradeFormSchema>) {
    console.log(values);
    toast({
      title: "Trade Logged!",
      description: `${values.instrument} trade has been saved.`,
    });
  }

  function onJournalSubmit(values: z.infer<typeof journalFormSchema>) {
    console.log(values);
    toast({
      title: "Journal Entry Saved!",
      description: "Your thoughts have been recorded.",
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Log Your Activity</DialogTitle>
          <DialogDescription>
            Add a new trade or journal entry. Consistency is key.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="trade" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trade">Trade</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
          </TabsList>
          <TabsContent value="trade">
            <Form {...tradeForm}>
              <form onSubmit={tradeForm.handleSubmit(onTradeSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={tradeForm.control}
                  name="instrument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instrument</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AAPL, BTC/USD" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={tradeForm.control}
                  name="profitOrLoss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profit / Loss ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 250.75" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={tradeForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Why did you take this trade?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={tradeForm.control}
                    name="emotion"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Emotion</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center space-x-4"
                            >
                            {emotions.map((emotion) => (
                                <FormItem key={emotion} className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value={emotion} id={`trade-${emotion}`} />
                                    </FormControl>
                                    <Label htmlFor={`trade-${emotion}`} className="text-2xl cursor-pointer">{emotion}</Label>
                                </FormItem>
                            ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Log Trade</Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="journal">
            <Form {...journalForm}>
              <form onSubmit={journalForm.handleSubmit(onJournalSubmit)} className="space-y-4 pt-4">
                 <FormField
                  control={journalForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Journal</FormLabel>
                      <FormControl>
                        <Textarea rows={6} placeholder="How was your trading day? What were your thoughts and emotions?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={journalForm.control}
                    name="emotion"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Overall Mood</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center space-x-4"
                            >
                            {emotions.map((emotion) => (
                                <FormItem key={emotion} className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value={emotion} id={`journal-${emotion}`} />
                                    </FormControl>
                                    <Label htmlFor={`journal-${emotion}`} className="text-2xl cursor-pointer">{emotion}</Label>
                                </FormItem>
                            ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Save Entry</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
