import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ForgotPasswordForm } from "../_components/forget-password";
import { CardHeader, CardTitle, CardDescription, CardFooter, Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Forgot Password - Bookmark Manager",
  description: "Reset your password by entering your email address.",
};

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md gap-8 border-none px-5 py-8 sm:px-8 sm:py-10">
      <Logo />
      <CardHeader className="gap-1.5 px-0">
        <CardTitle className="text-xl font-bold">Forgot your password?</CardTitle>
        <CardDescription className="leading-normal font-medium tracking-tight">
          Enter your email address below and we’ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <ForgotPasswordForm />
      <CardFooter className="justify-center">
        <Button asChild variant="link" size="auto">
          <Link href="/sign-in">Back to login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
