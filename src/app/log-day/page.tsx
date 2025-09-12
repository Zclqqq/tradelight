
"use client";

import * as React from "react";
import { format } from "date-fns";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";


const tradeSchema = z.object({
  instrument: z.string().min(1, "Instrument is required."),
  pnl: z.coerce.number(),
  date: z.string().optional(),
  entryTime: z.string().optional(),
  exitTime: z.string().optional(),
  contracts: z.coerce.number().optional(),
  tradeTp: z.coerce.number().optional(),
  tradeSl: z.coerce.number().optional(),
  totalPoints: z.coerce.number().optional(),
});

const dayLogSchema = z.object({
  notes: z.string().optional(),
  trades: z.array(tradeSchema),
});


export default function LogDayPage() {
    const { toast } = useToast();
    const [isEditingPnl, setIsEditingPnl] = React.useState(false);
    const pnlInputRef = React.useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof dayLogSchema>>({
        resolver: zodResolver(dayLogSchema),
        defaultValues: {
            notes: "",
            trades: [{ 
                instrument: "", 
                pnl: 0,
                date: format(new Date(), "yyyy-MM-dd"),
                entryTime: "",
                exitTime: "",
                contracts: 0,
                tradeTp: 0,
                tradeSl: 0,
                totalPoints: 0,
            }],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "trades",
    });

    const onSubmit = (values: z.infer<typeof dayLogSchema>) => {
        console.log(values);
        toast({
            title: "Day Logged!",
            description: "Your daily recap has been saved successfully.",
        });
    };

    const totalPnl = form.watch("trades").reduce((acc, trade) => acc + Number(trade.pnl || 0), 0);

    const handlePnlDoubleClick = () => {
        setIsEditingPnl(true);
    };

    const handlePnlBlur = () => {
        setIsEditingPnl(false);
    };

    const handlePnlKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const newPnl = parseFloat(event.currentTarget.value);
            if (!isNaN(newPnl)) {
                // Replace all trades with a single one for simplicity
                replace([{ instrument: "Summary", pnl: newPnl }]);
            }
            setIsEditingPnl(false);
        } else if (event.key === 'Escape') {
            setIsEditingPnl(false);
        }
    };
    
    React.useEffect(() => {
        if (isEditingPnl && pnlInputRef.current) {
            pnlInputRef.current.focus();
            pnlInputRef.current.select();
        }
    }, [isEditingPnl]);


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 border-b bg-background/80 backdrop-blur-sm">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft />
                </Link>
            </Button>
            <h1 className="text-xl font-bold font-headline text-center">
                Today Recap {format(new Date(), "M/d/yy")}
            </h1>
            <Button onClick={form.handleSubmit(onSubmit)}>Save Recap</Button>
        </header>

        <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto w-full max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-base">PNL</CardTitle>
                            </CardHeader>
                            <CardContent onDoubleClick={handlePnlDoubleClick}>
                                {isEditingPnl ? (
                                     <Input
                                        ref={pnlInputRef}
                                        type="number"
                                        defaultValue={totalPnl}
                                        onBlur={handlePnlBlur}
                                        onKeyDown={handlePnlKeyDown}
                                        className="text-3xl font-bold font-headline h-auto p-0 border-0 focus-visible:ring-0 bg-transparent"
                                     />
                                ) : (
                                    <p className={`text-3xl font-bold font-headline ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {totalPnl.toLocaleString("en-US", { style: "currency", currency: "USD"})}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-base">Chart</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-48 flex items-center justify-center bg-muted/50 rounded-none text-muted-foreground">
                                    Chart Placeholder
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-base">Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                               <Form {...form}>
                                    <form>
                                        <FormField
                                            control={form.control}
                                            name="notes"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormControl>
                                                    <Textarea className="bg-transparent border-0 p-0 focus-visible:ring-0 text-base" rows={6} placeholder="General notes for the day..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </form>
                               </Form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                     <div className="lg:col-span-1">
                         <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="font-headline">Trade Data Entry</CardTitle>
                            </CardHeader>
                            <CardContent>
                               <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-4 max-h-[calc(100vh-20rem)] overflow-y-auto pr-4">
                                        {fields.map((field, index) => (
                                        <div key={field.id} className="space-y-4 relative bg-card p-4 rounded-lg border">
                                            <FormField
                                                control={form.control}
                                                name={`trades.${index}.date`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between">
                                                    <FormLabel>Date</FormLabel>
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <Input type="date" className="text-right w-auto" {...field} />
                                                        </FormControl>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => remove(index)}
                                                            disabled={fields.length <= 1}
                                                            className="h-6 w-6"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`trades.${index}.instrument`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between">
                                                    <FormLabel>Instrument</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. NQ" className="text-right w-32" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex items-center justify-between">
                                                <FormLabel>Entry / Exit Time</FormLabel>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`trades.${index}.entryTime`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                            <FormControl>
                                                                <Input type="time" className="text-right" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`trades.${index}.exitTime`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                            <FormControl>
                                                                <Input type="time" className="text-right" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                             <FormField
                                                control={form.control}
                                                name={`trades.${index}.contracts`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between">
                                                    <FormLabel>Contracts</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="e.g. 10" className="text-right w-32" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex items-center justify-between">
                                                <FormLabel>TP / SL</FormLabel>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`trades.${index}.tradeTp`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                            <FormControl>
                                                                <Input type="number" placeholder="e.g. 4500.50" className="text-right" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`trades.${index}.tradeSl`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                            <FormControl>
                                                                <Input type="number" placeholder="e.g. 4400" className="text-right" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <FormLabel>Total Points / PNL ($)</FormLabel>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`trades.${index}.totalPoints`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                            <FormControl>
                                                                <Input type="number" className="text-right" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`trades.${index}.pnl`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                            <FormControl>
                                                                <Input type="number" placeholder="e.g. 250.75" className="text-right" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {index < fields.length - 1 && <hr className="my-4 border-border" />}
                                        </div>
                                        ))}
                                    </div>
                                     <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => append({ 
                                            instrument: "", 
                                            pnl: 0,
                                            date: format(new Date(), "yyyy-MM-dd"),
                                            entryTime: "",
                                            exitTime: "",
                                            contracts: 0,
                                            tradeTp: 0,
                                            tradeSl: 0,
                                            totalPoints: 0,
                                        })}
                                        className="w-full"
                                        >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Trade
                                    </Button>
                                </form>
                               </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );

    