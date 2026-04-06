"use client";

/**
 * components/layout/Navbar.tsx — Navigation Bar [STUB]
 *
 * Must be a Client Component because it uses:
 *  - usePathname() to highlight the active link
 *  - useSession() to show/hide the sign-in button
 *  - useState() for the mobile menu open/close
 *
 * TODO (Day 1):
 *  1. Import usePathname from "next/navigation"
 *  2. Import useSession, signIn, signOut from "next-auth/react"
 *  3. Build the desktop nav with links: Home, Blog, About
 *  4. Highlight the active link using cn() + pathname comparison
 *  5. Show user avatar (next/image) + dropdown if session exists, else "Sign in" button
 *  6. Add a <ThemeToggle /> from "@/components/theme/ThemeToggle"
 *  7. Build a mobile menu using <Sheet> from "@/components/ui/sheet"
 *
 * Hint: The Sheet and DropdownMenu components are already in components/ui/
 */

import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  // TODO: const pathname = usePathname();
  // TODO: const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Zap className="h-5 w-5 text-primary" />
          NextJS App
        </Link>

        {/* TODO: Desktop nav links with active-state highlighting */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* TODO: ThemeToggle + sign-in button or user avatar dropdown */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* TODO: Replace with real auth button */}
          <span className="text-sm text-muted-foreground border rounded px-3 py-1.5">
            Sign in (TODO)
          </span>
        </div>

        {/* TODO: Mobile sheet menu */}
      </div>
    </header>
  );
}
