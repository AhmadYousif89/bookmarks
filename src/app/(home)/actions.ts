"use server";

import { headers } from "next/headers";
import { auth } from "@/app/(auth)/lib/auth";
import { redirect } from "next/navigation";
import { APIError } from "better-auth";

export async function SignInDemoUser() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session && session.user.isDemo) {
    redirect("/dashboard");
  }

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email: "emily101@gmail.com",
        password: "12345678",
      },
    });
  } catch (error) {
    console.error("Error signing in demo user:", error);
    if (error instanceof APIError) {
      throw new Error(`Failed to sign in demo user: ${error.message}`);
    } else {
      throw new Error("An unexpected error occurred while signing in the demo user.");
    }
  }

  redirect("/dashboard");
}
