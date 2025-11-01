import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SignInForm } from "../_components/sign-in";
import { CardTitle, CardDescription, CardHeader, CardFooter } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <>
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
          <Button asChild variant="link">
            <Link href="/forgot-password" className="text-sm">
              Reset it
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-muted-foreground text-sm/normal font-medium">
            Don't have an account?
          </span>
          <Button asChild variant="link">
            <Link href="/sign-up" className="text-sm">
              Sign up
            </Link>
          </Button>
        </div>
      </CardFooter>
    </>
  );
}
