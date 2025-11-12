import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ResetPasswordForm } from "../_components/reset-password";
import { CardHeader, CardTitle, CardDescription, CardFooter, Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Reset Password - Bookmark Manager",
  description: "Reset your password to regain access to your account.",
};

export default function ResetPasswordPage() {
  return (
    <Card className="w-full max-w-md gap-8 border-none px-5 py-8 sm:px-8 sm:py-10">
      <Logo />
      <CardHeader className="gap-1.5 px-0">
        <CardTitle className="text-xl font-bold">Reset your password</CardTitle>
        <CardDescription className="leading-normal font-medium tracking-tight">
          Enter your new password below. Make sure it’s strong and secure.
        </CardDescription>
      </CardHeader>
      <ResetPasswordForm />
      <CardFooter className="justify-center">
        <Button asChild variant="link" size="auto">
          <Link href="/sign-in">Back to login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
