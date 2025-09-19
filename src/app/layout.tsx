
"use client";

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { TitleManager } from '@/components/title-manager';
import React, { useState, useEffect } from 'react';
import ParticlesComponent from '@/components/particles-component';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [particlesEnabled, setParticlesEnabled] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedParticles = localStorage.getItem("app-particles") === "true";
      setParticlesEnabled(storedParticles);
    };

    handleStorageChange(); // Set initial value

    window.addEventListener('storage', handleStorageChange);
    
    const customEvent = 'onLocalStorageChange';
    window.addEventListener(customEvent, handleStorageChange);


    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(customEvent, handleStorageChange);
    };
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased text-foreground bg-background font-light">
        {particlesEnabled && <ParticlesComponent />}
        <AuthProvider>
          <TitleManager />
          <div className="content-wrapper min-h-screen relative z-10">
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
