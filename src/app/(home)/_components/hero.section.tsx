import Link from "next/link";
import { headers } from "next/headers";
import { ArrowRight, Bookmark, Check, Sparkles } from "lucide-react";

import { auth } from "@/app/(auth)/lib/auth";
import { Button } from "@/components/ui/button";
import { StartDemoButton } from "./demo.button";

export const HeroSection = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const isUser = session?.user.isDemo === false;

  return (
    <section className="max-w-site site:py-24 site:px-0 mx-auto grid w-full grow items-center p-8 md:py-12 lg:py-20">
      <div className="grid items-center justify-between gap-16 md:grid-cols-2">
        <div className="space-y-8">
          <div className="md:max-w-card grid space-y-4">
            <div className="bg-card text-primary dark:text-primary-foreground flex max-w-3xs items-center justify-center gap-3 rounded-full px-4 py-2 text-sm leading-1 font-medium">
              <Sparkles className="dark:text-muted-foreground size-4 rotate-12 text-teal-800" />
              <span>The smarter way to save</span>
              <Sparkles className="dark:text-muted-foreground size-4 rotate-12 text-teal-800" />
            </div>
            <h1 className="text-xl/tight font-bold tracking-tight text-balance md:text-[2rem] lg:text-[3.5rem]">
              Never lose a link again
            </h1>
            <p className="text-muted-foreground text-sm font-medium md:text-base">
              Bookmark helps you organize, manage, and rediscover your bookmarks with intelligent
              tagging and powerful search.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-8 *:w-full md:w-fit md:*:w-40">
            <Button asChild>
              <Link href="/sign-up">
                Join Now <ArrowRight className="size-4" />
              </Link>
            </Button>
            <StartDemoButton isUser={isUser} />
          </div>
        </div>

        <div className="bg-card grid gap-4 self-end overflow-hidden rounded-2xl p-5 shadow-xl">
          <div className="bg-accent flex items-center gap-3 rounded-lg p-4 shadow-md">
            <div className="bg-primary/20 dark:bg-muted flex size-8 items-center justify-center rounded-md">
              <Bookmark className="text-muted-foreground fill-background size-5 dark:fill-teal-800" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Design Inspiration</div>
              <div className="text-muted-foreground text-xs">dribbble.com</div>
            </div>
            <Check className="text-muted-foreground size-5" />
          </div>
          <div className="bg-accent flex items-center gap-3 rounded-lg p-4 shadow-md delay-200!">
            <div className="bg-primary/20 dark:bg-muted flex size-8 items-center justify-center rounded-md">
              <Bookmark className="text-muted-foreground fill-background size-5 dark:fill-teal-800" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">React Documentation</div>
              <div className="text-muted-foreground text-xs">react.dev</div>
            </div>
            <Check className="text-muted-foreground size-5" />
          </div>
          <div className="bg-accent flex items-center gap-3 rounded-lg p-4 shadow-md delay-400!">
            <div className="bg-primary/20 dark:bg-muted flex size-8 items-center justify-center rounded-md">
              <Bookmark className="text-muted-foreground fill-background size-5 dark:fill-teal-800" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Next.js Guide</div>
              <div className="text-muted-foreground text-xs">nextjs.org</div>
            </div>
            <Check className="text-muted-foreground size-5" />
          </div>
        </div>
      </div>
    </section>
  );
};
