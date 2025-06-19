"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function ThemeHelper() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const getThemeIcon = () => {
    if (!mounted) {
      // Return a default icon during server-side rendering
      return <Monitor className="h-5 w-5 text-primary" />;
    }

    switch (theme) {
      case "dark":
        return <Sun className="h-5 w-5 text-primary" />;
      case "light":
        return <Moon className="h-5 w-5 text-primary" />;
      case "system":
        return <Monitor className="h-5 w-5 text-primary" />;
      default:
        return <Monitor className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="theme-button-light h-14 w-14 rounded-full border-primary/20 bg-background/90 backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:border-primary/40 hover:bg-background/95 group"
            >
              <div className="transition-transform duration-300 group-hover:rotate-12">
                {getThemeIcon()}
              </div>
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 glass-effect-strong shadow-light-2xl rounded-2xl p-2"
          >
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="rounded-xl py-3 px-4 transition-all duration-300 hover:bg-primary/10 hover:scale-105 cursor-pointer"
            >
              <Sun className="mr-3 h-4 w-4" />
              <span className="font-medium">Clair</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="rounded-xl py-3 px-4 transition-all duration-300 hover:bg-primary/10 hover:scale-105 cursor-pointer"
            >
              <Moon className="mr-3 h-4 w-4" />
              <span className="font-medium">Sombre</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="rounded-xl py-3 px-4 transition-all duration-300 hover:bg-primary/10 hover:scale-105 cursor-pointer"
            >
              <Monitor className="mr-3 h-4 w-4" />
              <span className="font-medium">Système</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
