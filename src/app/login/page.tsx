
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);
    
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (error: any) {
            toast({
                title: "Sign Up Failed",
                description: error.message,
                variant: "destructive",
            });
            console.error("Error signing up", error);
        }
    };
    
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (error: any) {
            toast({
                title: "Sign In Failed",
                description: error.message,
                variant: "destructive",
            });
            console.error("Error signing in", error);
        }
    };
    
    if (loading || user) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Welcome to TradeLight</CardTitle>
                    <CardDescription>Sign in or create an account to continue.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Tabs defaultValue="signin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="signin">Sign In</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="signin">
                            <form onSubmit={handleSignIn}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email-signin">Email</Label>
                                        <Input
                                            id="email-signin"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password-signin">Password</Label>
                                        <Input
                                            id="password-signin"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">Sign In</Button>
                                </div>
                            </form>
                        </TabsContent>
                        <TabsContent value="signup">
                            <form onSubmit={handleSignUp}>
                               <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email-signup">Email</Label>
                                        <Input
                                            id="email-signup"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password-signup">Password</Label>
                                        <Input
                                            id="password-signup"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.targe.value)}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">Create Account</Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
