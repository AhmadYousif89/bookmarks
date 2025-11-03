import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SignUpForm } from "../_components/sign-up";
import { CardTitle, CardDescription, CardHeader, CardFooter } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign Up - Bookmark Manager",
  description: "Create an account to start saving and managing your bookmarks.",
};

export default function SignUpPage() {
  return (
    <>
      <CardHeader className="gap-1.5 px-0">
        <CardTitle className="text-xl font-bold">Create your account</CardTitle>
        <CardDescription className="leading-normal font-medium tracking-tight">
          Join us and start saving your favorite links — organized, searchable, and always within
          reach.
        </CardDescription>
      </CardHeader>
      <SignUpForm />
      <CardFooter>
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-muted-foreground text-sm/normal font-medium">
            Already have an account?
          </span>
          <Button asChild variant="link">
            <Link href="/sign-in" className="text-sm">
              Log in
            </Link>
          </Button>
        </div>
      </CardFooter>
    </>
  );
}
