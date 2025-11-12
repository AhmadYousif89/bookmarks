import Link from "next/link";
import { Metadata } from "next";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { SignUpForm } from "../_components/sign-up";
import { CardTitle, CardDescription, CardHeader, CardFooter, Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign Up - Bookmark Manager",
  description: "Create an account to start saving and managing your bookmarks.",
};

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md gap-8 border-none px-5 py-8 sm:px-8 sm:py-10">
      <Logo />
      <CardHeader className="gap-1.5 px-0">
        <CardTitle className="text-xl font-bold">Create your account</CardTitle>
        <CardDescription className="leading-normal font-medium tracking-tight">
          Join us and start saving your favorite links — organized, searchable, and always within
          reach.
        </CardDescription>
      </CardHeader>
      <SignUpForm />
      <CardFooter className="self-center">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-muted-foreground text-sm/normal font-medium">
            Already have an account?
          </span>
          <Button asChild variant="link" size="auto">
            <Link href="/sign-in">Log in</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
