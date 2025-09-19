
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const themes = [
    { name: "Default", value: "theme-default" },
    { name: "Zinc", value: "theme-zinc" },
    { name: "Rose", value: "theme-rose" },
    { name: "Blue", value: "theme-blue" },
];

const fonts = [
    { name: "Default", value: "font-body" },
    { name: "Mono", value: "font-mono" },
]

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLogout: () => void;
}

export function SettingsDialog({ isOpen, onOpenChange, onLogout }: SettingsDialogProps) {
  const { user, loading, refreshUser } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [selectedTheme, setSelectedTheme] = useState("theme-default");
  const [selectedFont, setSelectedFont] = useState("font-body");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
    }
    const storedTheme = localStorage.getItem("app-theme") || "theme-default";
    const storedFont = localStorage.getItem("app-font") || "font-body";
    setSelectedTheme(storedTheme);
    setSelectedFont(storedFont);
    document.body.classList.add(storedTheme, storedFont);
  }, [user]);

  const handleThemeChange = (theme: string) => {
    document.body.classList.remove(...themes.map(t => t.value));
    document.body.classList.add(theme);
    localStorage.setItem("app-theme", theme);
    setSelectedTheme(theme);
  };
  
  const handleFontChange = (font: string) => {
    document.body.classList.remove(...fonts.map(f => f.value));
    document.body.classList.add(font);
    localStorage.setItem("app-font", font);
    setSelectedFont(font);
  };

  const handleNameSave = async () => {
    if (user) {
      try {
        await updateProfile(user, { displayName });
        toast({
          title: "Success",
          description: "Your display name has been updated.",
        });
        if (refreshUser) refreshUser();
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to update display name.",
          variant: "destructive",
        });
      }
    }
  };
  
  if (loading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account and preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <div className="flex gap-2">
                <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                />
                <Button onClick={handleNameSave}>Save</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>
            <RadioGroup
                value={selectedTheme}
                onValueChange={handleThemeChange}
                className="flex items-center space-x-2"
            >
                {themes.map((theme) => (
                    <div key={theme.value} className="flex items-center space-x-1">
                        <RadioGroupItem value={theme.value} id={theme.value} />
                        <Label htmlFor={theme.value} className="font-normal">{theme.name}</Label>
                    </div>
                ))}
            </RadioGroup>
          </div>

           <div className="space-y-2">
            <Label>Font</Label>
            <RadioGroup
                value={selectedFont}
                onValueChange={handleFontChange}
                className="flex items-center space-x-2"
            >
                {fonts.map((font) => (
                    <div key={font.value} className="flex items-center space-x-1">
                        <RadioGroupItem value={font.value} id={font.value} />
                        <Label htmlFor={font.value} className="font-normal">{font.name}</Label>
                    </div>
                ))}
            </RadioGroup>
          </div>
          
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={onLogout}>Log Out</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
