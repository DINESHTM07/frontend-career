"use client";

/**
 * components/theme/ThemeToggle.tsx — Dark/Light Mode Toggle (Client Component)
 *
 * Uses next-themes' useTheme() hook.
 * Cycles: light → dark → system
 */

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Prevent hydration mismatch: don't render icon until client mounts
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder with the same dimensions to avoid layout shift
    return <Button variant="ghost" size="icon" className="invisible" aria-hidden />;
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : theme === "dark" ? "system" : "light"} mode`}
    >
      {theme === "light" && <Sun className="h-4 w-4" />}
      {theme === "dark" && <Moon className="h-4 w-4" />}
      {theme === "system" && <Monitor className="h-4 w-4" />}
    </Button>
  );
}
