/**
 * components/home/FeaturesGrid.tsx — Features Grid [STUB]
 *
 * Server Component — no interactivity needed.
 *
 * TODO (Day 1):
 *  1. Define a `features` array with 6–8 items, each with:
 *     { icon: LucideIcon, title: string, description: string }
 *  2. Render a responsive grid (sm:grid-cols-2 lg:grid-cols-4)
 *  3. Each feature gets a Card with the icon, title, and description
 *  4. Icons: import from "lucide-react" — Zap, Shield, Database, Palette, Moon, Globe, Code2, Lock
 *
 * Hint: <feature.icon className="h-6 w-6 text-primary mb-2" />
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

// TODO: Replace this with a proper features array
const features = [
  { icon: Zap, title: "Feature 1", description: "TODO: describe this feature" },
  { icon: Zap, title: "Feature 2", description: "TODO: describe this feature" },
  { icon: Zap, title: "Feature 3", description: "TODO: describe this feature" },
  { icon: Zap, title: "Feature 4", description: "TODO: describe this feature" },
];

export function FeaturesGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <Card key={feature.title}>
          <CardHeader className="pb-2">
            {/* TODO: Use feature.icon, not hardcoded Zap */}
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
