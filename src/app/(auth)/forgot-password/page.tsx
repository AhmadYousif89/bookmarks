import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ForgotPasswordForm } from "../_components/forget-password";

export default function ForgotPasswordPage() {
  return (
    <>
      <CardHeader className="gap-1.5 px-0">
        <CardTitle className="text-xl font-bold">Forgot your password?</CardTitle>
        <CardDescription className="leading-normal font-medium tracking-tight">
          Enter your email address below and we’ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <ForgotPasswordForm />
      <CardFooter className="justify-center">
        <Button asChild variant="link" className="text-sm/tight font-semibold">
          <Link href="/sign-in">Back to login</Link>
        </Button>
      </CardFooter>
    </>
  );
}
