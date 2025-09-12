
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";


const tradeSchema = z.object({
  instrument: z.string().min(1, "Instrument is required."),
  pnl: z.coerce.number(),
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
        trades: [{ instrument: "", pnl: 0 }],
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
            <div className="mx-auto w-full max-w-7xl">
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
                                                    <Textarea rows={6} placeholder="General notes for the day..." {...field} />
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
                                    <div className="space-y-4">
                                        {fields.map((field, index) => (
                                        <div key={field.id} className="flex items-end gap-4 p-4 border rounded-none">
                                           <div className="grid grid-cols-2 gap-4 flex-1">
                                                <FormField
                                                    control={form.control}
                                                    name={`trades.${index}.instrument`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                        <FormLabel>Instrument</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. AAPL" {...field} />
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
                                                        <FormLabel>PNL ($)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="e.g. 250.75" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                           </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                disabled={fields.length <= 1}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        ))}
                                    </div>
                                     <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => append({ instrument: "", pnl: 0 })}
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
