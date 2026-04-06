"use client";

/**
 * components/ui/sonner.tsx — Sonner Toast Integration
 *
 * Sonner is the toast library recommended by Shadcn/UI.
 * This wrapper applies the current theme so toasts match dark/light mode.
 *
 * Usage (from anywhere):
 *   import { toast } from "sonner";
 *   toast.success("Saved!");
 *   toast.error("Something went wrong");
 *   toast("Neutral message");
 *   toast.promise(fetchData(), { loading: "Loading...", success: "Done!", error: "Failed" });
 *
 * The <Toaster /> component is placed in app/layout.tsx once.
 */

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
