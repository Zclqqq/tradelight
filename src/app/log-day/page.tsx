
"use client";

import * as React from "react";
import { format } from "date-fns";
import { ArrowLeft, Plus, Trash2, CalendarIcon, Upload, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";


const sessionTradeSchema = z.object({
  sessionName: z.string(),
  direction: z.enum(["consolidation", "sweep-up", "sweep-down", "sweep-both"]),
});

const tradeSchema = z.object({
  instrument: z.string().min(1, "Instrument is required."),
  pnl: z.coerce.number(),
  entryTime: z.string().optional(),
  exitTime: z.string().optional(),
  contracts: z.coerce.number().optional(),
  tradeTp: z.coerce.number().optional(),
  tradeSl: z.coerce.number().optional(),
  totalPoints: z.coerce.number().optional(),
  analysisImage: z.string().optional(),
  analysisText: z.string().optional(),
  sessions: z.array(sessionTradeSchema).optional(),
  chartPerformance: z.string().optional(),
});

const dayLogSchema = z.object({
  date: z.date(),
  notes: z.string().optional(),
  trades: z.array(tradeSchema),
});

export type DayLog = z.infer<typeof dayLogSchema>;

const sessionOptions = ["Asia", "London", "New York", "Lunch", "PM"];
const chartPerformanceOptions = ["Consolidation", "Small Move", "Hit TP", "Hit SL", "Hit SL and then TP"];

const TradeDataField = ({ label, children, actionButton }: { label: string, children: React.ReactNode, actionButton?: React.ReactNode }) => {
    return (
        <Collapsible className="py-3 border-b border-border/20">
            <div className="flex items-center justify-between">
                <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">{label}</span>
                    <div className="flex items-center">
                        {actionButton}
                        <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]:rotate-180" />
                    </div>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
                <div className="mt-3">
                    {children}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};


export default function LogDayPage() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isEditingPnl, setIsEditingPnl] = React.useState(false);
    const pnlInputRef = React.useRef<HTMLInputElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof dayLogSchema>>({
        resolver: zodResolver(dayLogSchema),
        defaultValues: {
            date: new Date(),
            notes: "",
            trades: [],
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "trades",
    });

    const { fields: sessionFields, append: appendSession, remove: removeSession } = useFieldArray({
        control: form.control,
        name: "trades.0.sessions",
    });
    
    const watchedSessions = form.watch("trades.0.sessions");


    React.useEffect(() => {
        const dateParam = searchParams.get('date');
        const date = dateParam ? new Date(dateParam) : new Date();
        const key = `trade-log-${format(date, 'yyyy-MM-dd')}`;
        const savedData = localStorage.getItem(key);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            parsedData.date = new Date(parsedData.date); // Convert date string back to Date object
            form.reset(parsedData);
        } else {
             form.reset({
                date: date,
                notes: "",
                trades: [{ instrument: "Summary", pnl: 0, sessions: [] }],
             });
        }
    }, [searchParams, form]);
    
    const handleImagePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        form.setValue("trades.0.analysisImage", e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                form.setValue("trades.0.analysisImage", e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (values: z.infer<typeof dayLogSchema>) => {
        const key = `trade-log-${format(values.date, 'yyyy-MM-dd')}`;
        const dataToSave = {
            ...values,
            date: values.date.toISOString(), // a non-serializable value
        };
        localStorage.setItem(key, JSON.stringify(dataToSave));
        
        // Update the main trade list
        const allLogs = Object.keys(localStorage)
            .filter(k => k.startsWith('trade-log-'))
            .map(k => JSON.parse(localStorage.getItem(k) as string));

        localStorage.setItem('all-trades', JSON.stringify(allLogs));
        
        toast({
            title: "Day Logged!",
            description: "Your daily recap has been saved successfully.",
        });
        router.push('/');
    };
    
    const allTrades = form.watch("trades");
    const totalPnl = allTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const analysisImage = form.watch("trades.0.analysisImage");


    const handlePnlDoubleClick = () => {
        setIsEditingPnl(true);
    };

    const handlePnlBlur = () => {
        setIsEditingPnl(false);
    };

    const handlePnlKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const newPnl = parseFloat(event.currentTarget.value);
            if (!isNaN(newPnl) && fields[0]) {
                update(0, {...fields[0], pnl: newPnl });
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
    <div className="flex flex-col min-h-screen text-foreground">
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 border-b border-border/20 bg-background/95 backdrop-blur-sm">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft />
                </Link>
            </Button>
            <h1 className="text-xl font-bold font-headline text-center">
                Today's Recap {format(form.watch("date"), "M/d/yy")}
            </h1>
            <div className="flex items-center gap-2">
                <Button onClick={form.handleSubmit(onSubmit)}>Save Recap</Button>
            </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="mx-auto w-full max-w-6xl">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                                                className={cn(
                                                    `text-4xl font-bold font-headline h-auto p-0 border-0 focus-visible:ring-0 bg-transparent`,
                                                    `[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`,
                                                    totalPnl >= 0 ? 'text-green-500' : 'text-red-500'
                                                )}
                                            />
                                        ) : (
                                            <p className={`text-4xl font-bold font-headline ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {totalPnl.toLocaleString("en-US", { style: "currency", currency: "USD"})}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                                <Card onPaste={handleImagePaste} className="overflow-hidden">
                                     <CardHeader>
                                        <CardTitle className="font-headline text-base">Chart</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="flex flex-col text-left">
                                        {analysisImage ? (
                                             <div className="w-full">
                                                <div className="relative w-full">
                                                    <Image src={analysisImage} alt="Trade analysis" width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                                                </div>
                                                <div className="p-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="trades.0.analysisText"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input className="bg-transparent border-0 p-0 h-auto text-sm placeholder:text-gray-400" placeholder="Add a short description..." {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-[350px]">
                                                <Upload className="h-8 w-8" />
                                                <p className="text-sm font-medium">Paste or upload an image of your trade.</p>
                                                 <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                                    Upload File
                                                </Button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                            </div>
                                        )}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-base">Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
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
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-1">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-base">Trade Data</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                            <div className="py-3 border-b border-border/20">
                                                <FormField
                                                    control={form.control}
                                                    name="date"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col space-y-2">
                                                            <FormLabel className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Date</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                    variant={"ghost"}
                                                                    className={cn(
                                                                        "w-full justify-start text-left font-normal p-0 h-auto text-base hover:bg-transparent hover:text-foreground",
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
                                            </div>
                                            
                                            <div className="space-y-0">
                                                <TradeDataField 
                                                    label="Sessions"
                                                    actionButton={
                                                        <Button type="button" variant="ghost" size="sm" className="text-primary hover:bg-primary/10 hover:text-primary h-auto p-0" onClick={(e) => { e.stopPropagation(); appendSession({ sessionName: '', direction: 'consolidation' }); }}>
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                >
                                                    <div className="space-y-2">
                                                        {sessionFields.map((field, index) => {
                                                            const selectedSessions = watchedSessions?.map(s => s.sessionName) || [];
                                                            const availableOptions = sessionOptions.filter(opt => !selectedSessions.includes(opt) || opt === field.sessionName);
                                                            
                                                            return (
                                                                <div key={field.id} className="flex gap-2 items-center">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`trades.0.sessions.${index}.sessionName`}
                                                                        render={({ field }) => (
                                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <FormControl>
                                                                                    <SelectTrigger>
                                                                                        <SelectValue placeholder="Session" />
                                                                                    </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                    {availableOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        )}
                                                                    />
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`trades.0.sessions.${index}.direction`}
                                                                        render={({ field }) => (
                                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <FormControl>
                                                                                    <SelectTrigger>
                                                                                        <SelectValue placeholder="Side" />
                                                                                    </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                    <SelectItem value="consolidation">Consolidation</SelectItem>
                                                                                    <SelectItem value="sweep-up">Sweep Up</SelectItem>
                                                                                    <SelectItem value="sweep-down">Sweep Down</SelectItem>
                                                                                    <SelectItem value="sweep-both">Sweep Both</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        )}
                                                                    />
                                                                    <Button variant="ghost" size="icon" onClick={() => removeSession(index)} className="shrink-0">
                                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                                    </Button>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </TradeDataField>
                                                 <TradeDataField label="Chart Performance">
                                                    <FormField
                                                        control={form.control}
                                                        name="trades.0.chartPerformance"
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select performance..." />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {chartPerformanceOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </TradeDataField>
                                                <TradeDataField label="Instrument">
                                                    <FormField
                                                        control={form.control}
                                                        name="trades.0.instrument"
                                                        render={({ field }) => <Input placeholder="e.g. NQ" {...field} />}
                                                    />
                                                </TradeDataField>
                                                <TradeDataField label="Entry / Exit Time">
                                                    <div className="flex justify-start gap-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="trades.0.entryTime"
                                                            render={({ field }) => <Input type="time" {...field} />}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="trades.0.exitTime"
                                                            render={({ field }) => <Input type="time" {...field} />}
                                                        />
                                                    </div>
                                                </TradeDataField>
                                                <TradeDataField label="Contracts">
                                                     <FormField
                                                        control={form.control}
                                                        name="trades.0.contracts"
                                                        render={({ field }) => <Input type="number" placeholder="0" {...field} />}
                                                    />
                                                </TradeDataField>
                                                <TradeDataField label="TP / SL">
                                                    <div className="flex gap-2">
                                                         <FormField
                                                            control={form.control}
                                                            name="trades.0.tradeTp"
                                                            render={({ field }) => <Input type="number" placeholder="TP" {...field} />}
                                                        />
                                                         <FormField
                                                            control={form.control}
                                                            name="trades.0.tradeSl"
                                                            render={({ field }) => <Input type="number" placeholder="SL" {...field} />}
                                                        />
                                                    </div>
                                                </TradeDataField>
                                                <TradeDataField label="Points">
                                                    <FormField
                                                        control={form.control}
                                                        name="trades.0.totalPoints"
                                                        render={({ field }) => <Input type="number" placeholder="0" {...field} />}
                                                    />
                                                </TradeDataField>
                                            </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </main>
    </div>
  );
}

    