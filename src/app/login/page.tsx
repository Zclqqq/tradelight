
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function LoginPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);
    
    const handleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push('/');
        } catch (error) {
            console.error("Error signing in with Google", error);
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
                    <CardDescription>Sign in to continue to your journal.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSignIn} className="w-full">
                        Sign In with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
