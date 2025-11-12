import Link from "next/link";
import { Metadata } from "next";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { SignInForm } from "../_components/sign-in";
import { CardTitle, CardDescription, CardHeader, CardFooter, Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign In - Bookmark Manager",
  description: "Log in to your account to access and manage your bookmarks.",
};

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md gap-8 border-none px-5 py-8 sm:px-8 sm:py-10">
      <Logo />
      <CardHeader className="gap-1.5 px-0">
        <CardTitle className="text-xl font-bold">Log in to your account</CardTitle>
        <CardDescription className="leading-normal font-medium tracking-tight">
          Welcome back! Please enter your details.
        </CardDescription>
      </CardHeader>
      <SignInForm />
      <CardFooter className="grid items-center justify-center gap-3">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-muted-foreground text-sm/normal font-medium">Forgot password?</span>
          <Button asChild variant="link" size="auto">
            <Link href="/forgot-password">Reset it</Link>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-muted-foreground text-sm/normal font-medium">
            Don't have an account?
          </span>
          <Button asChild variant="link" size="auto">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
