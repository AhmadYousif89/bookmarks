"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./ui/icon";
import { Button } from "./ui/button";

export const ThemeSwitcher = ({ className, ...props }: React.ComponentProps<typeof Button>) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <Button
      variant="ghost"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className={cn("bg-muted h-7.5 min-w-16 gap-0 rounded p-0.5", className)}
      {...props}
    >
      <span className="relative isolate grid h-7.5 w-full place-items-center p-0">
        <div className="absolute inset-0 -z-10 my-px translate-x-0 rounded bg-white transition-transform! duration-300 ease-in-out dark:translate-x-full dark:bg-(--neutral-dark-600)" />
        <Icon name="light-theme" className="scale-80 **:stroke-black dark:**:stroke-white" />
      </span>
      <span className="z-10 grid h-7.5 w-full place-items-center p-0">
        <Icon name="dark-theme" className="scale-80 **:stroke-black dark:**:stroke-white" />
      </span>
    </Button>
  );
};
