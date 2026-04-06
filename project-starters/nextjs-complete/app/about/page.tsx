/**
 * app/about/page.tsx — About Page (Server Component)
 *
 * Static page — no data fetching needed, so Next.js will pre-render this
 * at build time and serve it as a static file (SSG).
 */

import type { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Twitter, Linkedin } from "lucide-react";

// This metadata overrides the root layout's template: "About | NextJS App"
export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about this project, the tech stack, and the team behind it.",
  openGraph: {
    title: "About | NextJS App",
    description: "Learn about this project, the tech stack, and the team behind it.",
  },
};

const techStack = [
  { name: "Next.js 14", description: "App Router, Server Components, Streaming" },
  { name: "TypeScript", description: "Type-safe development" },
  { name: "Tailwind CSS", description: "Utility-first styling" },
  { name: "Shadcn/UI", description: "Accessible component library" },
  { name: "NextAuth.js", description: "Authentication (Google OAuth)" },
  { name: "Supabase", description: "PostgreSQL database + storage" },
  { name: "next-themes", description: "Dark mode support" },
  { name: "Sonner", description: "Toast notifications" },
];

const team = [
  {
    name: "Jane Doe",
    role: "Lead Developer",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    bio: "Full-stack engineer with 8 years of experience building web apps.",
    socials: {
      github: "https://github.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    name: "John Smith",
    role: "UI Designer",
    avatar: "https://avatars.githubusercontent.com/u/2?v=4",
    bio: "Passionate about accessible, beautiful interfaces.",
    socials: {
      github: "https://github.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
];

export default function AboutPage() {
  return (
    <div className="container py-12 space-y-16">
      {/* Page Header */}
      <div className="max-w-2xl">
        <Badge variant="outline" className="mb-4">About this project</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          A production-ready Next.js starter
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          This template gives you a head start with authentication, a database,
          dark mode, and a full component library — all wired up and ready to go.
          Fork it, fill in your .env file, and start building.
        </p>
      </div>

      {/* Tech Stack */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Tech Stack</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {techStack.map((tech) => (
            <Card key={tech.name}>
              <CardContent className="pt-6">
                <p className="font-semibold">{tech.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tech.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-2xl font-bold mb-6">The Team</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {team.map((member) => (
            <Card key={member.name}>
              <CardContent className="flex gap-4 pt-6">
                {/* next/image with explicit width/height for avatar */}
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover flex-shrink-0"
                />
                <div className="space-y-1">
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <p className="text-sm">{member.bio}</p>
                  <div className="flex gap-3 pt-1">
                    <a
                      href={member.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`${member.name} GitHub`}
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    <a
                      href={member.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`${member.name} Twitter`}
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
