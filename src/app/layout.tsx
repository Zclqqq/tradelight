
"use client";

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { TitleManager } from '@/components/title-manager';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ParticlesComponent = dynamic(() => import('@/components/particles-component'), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [particlesEnabled, setParticlesEnabled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleThemeAndParticles = () => {
      const storedTheme = localStorage.getItem("app-theme") || "theme-default";
      const storedFont = localStorage.getItem("app-font") || "font-body";
      const storedParticles = localStorage.getItem("app-particles") === "true";
      
      document.documentElement.className = storedTheme;
      document.body.classList.add(storedFont);
      setParticlesEnabled(storedParticles);
    };

    handleThemeAndParticles();

    const storageChangeHandler = () => {
      handleThemeAndParticles();
    };

    window.addEventListener('storage', storageChangeHandler);
    window.addEventListener('onLocalStorageChange', storageChangeHandler);

    return () => {
      window.removeEventListener('storage', storageChangeHandler);
      window.removeEventListener('onLocalStorageChange', storageChangeHandler);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased text-foreground bg-background font-light">
        {isClient && particlesEnabled && <ParticlesComponent />}
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
