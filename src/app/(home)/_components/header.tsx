import Link from "next/link";
import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/app/(auth)/lib/auth";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeSwitcher } from "@/components/theme.switch";

export const HomeHeader = async () => {
  return (
    <header className="bg-card border-muted/50 w-full border-b px-4 py-6">
      <nav className="max-w-site relative mx-auto flex items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeSwitcher className="absolute top-full right-0 h-auto translate-y-[80%] shadow-md" />
          <Suspense fallback={<Skeleton className="h-10 min-w-28 animate-pulse px-4" />}>
            <AuthButton />
          </Suspense>
        </div>
      </nav>
    </header>
  );
};

const AuthButton = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <Button asChild className="h-10">
      {session ? (
        <Link href="/dashboard" className="w-fit px-4">
          Dashboard
        </Link>
      ) : (
        <Link href="/sign-in" className="max-w-24">
          Sign In
        </Link>
      )}
    </Button>
  );
};
