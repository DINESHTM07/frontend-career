"use client";

/**
 * components/home/HeroSection.tsx — Hero (Client Component)
 *
 * Client Component for the animated "copy install command" button.
 * The rest is static markup that could be server-rendered, but
 * one interactive element makes the whole component client-side.
 *
 * Tip: Extract the copy button into its own Client Component and keep
 * the surrounding hero as a Server Component for maximum server rendering.
 */

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, Check, ArrowRight } from "lucide-react";

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const installCommand = "npx create-next-app@latest --example nextjs-complete";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="container flex flex-col items-center gap-8 py-24 text-center md:py-32">
      {/* Eyebrow badge */}
      <Badge variant="outline" className="gap-1.5 px-4 py-1.5">
        <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
        Next.js 14 + App Router
      </Badge>

      <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl lg:text-7xl">
        Build faster with{" "}
        <span className="text-primary">Next.js 14</span>
      </h1>

      <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
        A production-ready starter with App Router, Shadcn/UI, NextAuth, Supabase,
        dark mode, and SEO — all wired up and ready to ship.
      </p>

      {/* CTA buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button size="lg" asChild>
          <Link href="/blog">
            Read the blog
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/about">View tech stack</Link>
        </Button>
      </div>

      {/* Copy install command */}
      <div
        className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3 font-mono text-sm cursor-pointer hover:bg-muted transition-colors"
        onClick={handleCopy}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleCopy()}
        aria-label="Copy install command"
      >
        <span className="text-muted-foreground">$</span>
        <span>{installCommand}</span>
        {copied ? (
          <Check className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
        )}
      </div>
    </section>
  );
}
