"use client";

import { useAppearance } from "@/hooks/use-appearance";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { appearance, updateAppearance } = useAppearance();

  const toggleTheme = () => {
    updateAppearance(appearance === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-12 w-12 items-center justify-center rounded-full 
        bg-gradient-to-br from-amber-100 to-orange-200 
        dark:from-indigo-900 dark:to-purple-900
        shadow-lg shadow-orange-200/50 dark:shadow-purple-900/50
        hover:shadow-xl hover:shadow-orange-300/50 dark:hover:shadow-purple-800/50
        hover:scale-110 active:scale-95
        transition-all duration-300 ease-out
        border-2 border-amber-200/50 dark:border-purple-500/30
        overflow-hidden group"
      aria-label="Toggle theme"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-orange-400/20 dark:from-blue-500/20 dark:to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Sun Icon */}
      <Sun
        className="absolute h-6 w-6 text-amber-600 
          transform transition-all duration-500 ease-out
          scale-100 rotate-0 opacity-100
          dark:scale-0 dark:-rotate-180 dark:opacity-0"
        strokeWidth={2.5}
      />

      {/* Moon Icon */}
      <Moon
        className="absolute h-5 w-5 text-purple-200
          transform transition-all duration-500 ease-out
          scale-0 rotate-180 opacity-0
          dark:scale-100 dark:rotate-0 dark:opacity-100"
        strokeWidth={2.5}
      />

      {/* Sparkle effects for light mode */}
      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-400/60 rounded-full dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute bottom-2 left-1.5 w-1 h-1 bg-orange-400/50 rounded-full dark:opacity-0 transition-opacity duration-300" />

      {/* Star effects for dark mode */}
      <div className="absolute top-2 right-2 w-1 h-1 bg-white/0 dark:bg-white/60 rounded-full transition-all duration-300" />
      <div className="absolute bottom-3 left-2 w-0.5 h-0.5 bg-white/0 dark:bg-white/40 rounded-full transition-all duration-300" />
      <div className="absolute top-3 left-3 w-0.5 h-0.5 bg-white/0 dark:bg-white/30 rounded-full transition-all duration-300" />
    </button>
  );
}
