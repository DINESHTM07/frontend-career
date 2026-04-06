"use client";

/**
 * components/theme/ThemeToggle.tsx — Dark/Light Mode Toggle [STUB]
 *
 * TODO (Day 6 — but works before then):
 *  1. Import useTheme from "next-themes" and useState, useEffect from "react"
 *  2. Add a `mounted` state to prevent hydration mismatch:
 *     const [mounted, setMounted] = useState(false);
 *     useEffect(() => setMounted(true), []);
 *     if (!mounted) return <Button variant="ghost" size="icon" className="invisible" />;
 *  3. Use theme === "light" ? <Sun /> : theme === "dark" ? <Moon /> : <Monitor />
 *  4. On click, cycle: light → dark → system → light
 *
 * The button below is a working placeholder — replace it when you tackle dark mode.
 */

import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";

export function ThemeToggle() {
  // TODO: implement with useTheme() from "next-themes"
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme (TODO)"
      title="Toggle theme — implement in ThemeToggle.tsx"
    >
      <Sun className="h-4 w-4" />
    </Button>
  );
}
