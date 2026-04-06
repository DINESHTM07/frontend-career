"use client";

/**
 * components/home/HeroSection.tsx — Hero Section [STUB]
 *
 * Must be a Client Component because of the "copy to clipboard" button.
 *
 * TODO (Day 1):
 *  1. Add a Badge eyebrow label ("Next.js 14 + App Router")
 *  2. Add a large h1 headline
 *  3. Add a subtitle paragraph
 *  4. Add two CTA buttons using <Button asChild><Link>...</Link></Button>
 *  5. Add a "copy install command" div:
 *     - Show the command in a monospace box
 *     - On click: navigator.clipboard.writeText(cmd) then toast.success("Copied!")
 *     - Show a Check icon briefly after copying (useState + setTimeout)
 *
 * Hint: import { toast } from "sonner" for toast notifications
 *       import { Copy, Check, ArrowRight } from "lucide-react" for icons
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  // TODO: const [copied, setCopied] = useState(false);
  // TODO: const installCommand = "npx create-next-app@latest ...";

  return (
    <section className="container flex flex-col items-center gap-8 py-24 text-center">
      {/* TODO: Badge eyebrow */}

      {/* TODO: h1 headline */}
      <h1 className="text-5xl font-black tracking-tight">
        Build your{" "}
        <span className="text-primary">Hero Section</span>
      </h1>

      {/* TODO: subtitle */}
      <p className="max-w-xl text-lg text-muted-foreground">
        TODO: Add a compelling subtitle here.
      </p>

      {/* TODO: CTA buttons */}
      <div className="flex gap-4">
        <Button size="lg" asChild>
          <Link href="/blog">Read the blog</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/about">About</Link>
        </Button>
      </div>

      {/* TODO: Copy-to-clipboard install command */}
      <div className="rounded-lg border bg-muted/50 px-4 py-3 font-mono text-sm text-muted-foreground cursor-pointer">
        $ npx create-next-app@latest — click to copy (TODO)
      </div>
    </section>
  );
}
