import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ResetPasswordForm } from "../_components/reset-password";
import { CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reset Password - Bookmark Manager",
  description: "Reset your password to regain access to your account.",
};

export default function ResetPasswordPage() {
  return (
    <>
      <CardHeader className="gap-1.5 px-0">
        <CardTitle className="text-xl font-bold">Reset your password</CardTitle>
        <CardDescription className="leading-normal font-medium tracking-tight">
          Enter your new password below. Make sure it’s strong and secure.
        </CardDescription>
      </CardHeader>
      <ResetPasswordForm />
      <CardFooter className="justify-center">
        <Button asChild variant="link" className="text-sm/tight font-semibold">
          <Link href="/sign-in">Back to login</Link>
        </Button>
      </CardFooter>
    </>
  );
}
