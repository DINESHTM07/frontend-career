/**
 * components/home/FeaturesGrid.tsx — Features Grid (Server Component)
 *
 * Pure static content — no interactivity, stays server-side.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap,
  Shield,
  Palette,
  Database,
  Moon,
  Globe,
  Code2,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Next.js 14 App Router",
    description:
      "Server Components, streaming, parallel routes, and intercepting routes out of the box.",
  },
  {
    icon: Shield,
    title: "NextAuth.js",
    description:
      "Google OAuth configured and ready. Session management, protected routes, JWT strategy.",
  },
  {
    icon: Database,
    title: "Supabase Ready",
    description:
      "Browser and server clients configured. RLS-aware queries. Type generation setup.",
  },
  {
    icon: Palette,
    title: "Shadcn/UI",
    description:
      "Button, Card, Input, Dialog, Sheet, Table, Toast — accessible, unstyled, ownable.",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    description:
      "next-themes with CSS variable theming. Respects OS preference. Zero flash on load.",
  },
  {
    icon: Globe,
    title: "SEO + OpenGraph",
    description:
      "Metadata API, per-page OG images, Twitter cards, generateMetadata() for dynamic routes.",
  },
  {
    icon: Code2,
    title: "TypeScript",
    description:
      "Strict mode, path aliases, Supabase type generation, NextAuth type extensions.",
  },
  {
    icon: Lock,
    title: "Middleware Protection",
    description:
      "Edge middleware with withAuth. Protected routes redirect to sign-in automatically.",
  },
];

export function FeaturesGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <Card key={feature.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <feature.icon className="h-6 w-6 text-primary mb-2" />
            <CardTitle className="text-base">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
