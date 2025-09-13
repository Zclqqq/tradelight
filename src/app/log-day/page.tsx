
"use client";

import * as React from "react";
import { format } from "date-fns";
import { ArrowLeft, Plus, Trash2, CalendarIcon } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";


const tradeSchema = z.object({
  instrument: z.string().min(1, "Instrument is required."),
  pnl: z.coerce.number(),
  entryTime: z.string().optional(),
  exitTime: z.string().optional(),
  contracts: z.coerce.number().optional(),
  tradeTp: z.coerce.number().optional(),
  tradeSl: z.coerce.number().optional(),
  totalPoints: z.coerce.number().optional(),
});

const dayLogSchema = z.object({
  date: z.date(),
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
            date: new Date(),
            notes: "",
            trades: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "trades",
    });

    // Initialize with one default trade entry if none exist
    React.useEffect(() => {
        if (fields.length === 0) {
            append({ 
                instrument: "", 
                pnl: 0,
                entryTime: "",
                exitTime: "",
                contracts: 0,
                tradeTp: 0,
                tradeSl: 0,
                totalPoints: 0,
            });
        }
    }, [fields, append]);

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
                // For simplicity, we create a single summary trade. 
                // You might want a more sophisticated way to handle this.
                form.setValue('trades', [{ 
                    instrument: "Summary", 
                    pnl: newPnl,
                }]);
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
                Today Recap {format(form.watch("date"), "M/d/yy")}
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
                                                    <Textarea className="bg-transparent border-0 p-0 focus-visible:ring-0 text-base min-h-[100px]" placeholder="General notes for the day..." {...field} />
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
                         <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Trade Data Entry</CardTitle>
                            </CardHeader>
                            <CardContent>
                               <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                     <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                            <FormLabel>Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        <Separator/>

                                    <div className="space-y-6">
                                        {fields.map((field, index) => (
                                        <div key={field.id} className="space-y-4 relative">
                                            
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-medium">
                                                    {fields.length > 1 ? `Trade ${index + 1}`: 'Daily Summary'}
                                                </h3>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length < 1}
                                                    className="h-6 w-6"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name={`trades.${index}.instrument`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Instrument</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. NQ" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`trades.${index}.entryTime`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                        <FormLabel>Entry Time</FormLabel>
                                                        <FormControl>
                                                            <Input type="time" {...field} />
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
                                                        <FormLabel>Exit Time</FormLabel>
                                                        <FormControl>
                                                            <Input type="time" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                             <FormField
                                                control={form.control}
                                                name={`trades.${index}.contracts`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormLabel>Contracts</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="0" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`trades.${index}.tradeTp`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>TP</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="0" {...field} />
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
                                                            <FormLabel>SL</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="0" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                 <FormField
                                                    control={form.control}
                                                    name={`trades.${index}.totalPoints`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                        <FormLabel>Points</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="0" {...field} />
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
                                                        <FormLabel>PNL</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="0.00" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {index < fields.length - 1 && <Separator className="!mt-6" />}
                                        </div>
                                        ))}
                                    </div>
                                     <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => append({ 
                                            instrument: "", 
                                            pnl: 0,
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
}

    