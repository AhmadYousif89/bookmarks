"use server";

import { redirect } from "next/navigation";
import { BetterAuthError } from "better-auth";

import {
  SignInSchema,
  SignUpSchema,
  ForgetPasswordSchema,
  ResetPasswordSchema,
} from "./lib/schema";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export const signInAction = async (formData: FormData) => {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { success, error, data } = SignInSchema.safeParse(rawData);
  if (!success) {
    const msg = error.issues[0].message;
    const path = error.issues[0].path[0];
    return { success: false, error: { [path]: msg } };
  }

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: { email: data.email, password: data.password },
    });

    redirect("/dashboard");
  } catch (err) {
    if (err instanceof BetterAuthError) {
      return { success: false, error: err.message };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "Something went wrong. Please try again.",
    };
  }
};

export const signUpAction = async (formData: FormData) => {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { success, error, data } = SignUpSchema.safeParse(rawData);
  if (!success) {
    const msg = error.issues[0].message;
    const path = error.issues[0].path[0];
    return { success: false, error: { [path]: msg } };
  }

  try {
    await auth.api.signUpEmail({
      headers: await headers(),
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return { success: true, message: "Account created successfully. Please verify your email." };
  } catch (err) {
    if (err instanceof BetterAuthError) {
      return { success: false, error: err.message };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "Something went wrong. Please try again.",
    };
  }
};

export const forgetPasswordAction = async (formData: FormData) => {
  const rawData = {
    email: formData.get("email") as string,
  };

  const { success, error, data } = ForgetPasswordSchema.safeParse(rawData);
  if (!success) {
    const msg = error.issues[0].message;
    const path = error.issues[0].path[0];
    return {
      success: false,
      error: { [path]: msg },
    };
  }

  try {
    await auth.api.forgetPassword({
      headers: await headers(),
      body: { email: data.email },
    });

    redirect("/reset-password");
  } catch (err) {
    if (err instanceof BetterAuthError) {
      return { success: false, error: err.message };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "Something went wrong. Please try again.",
    };
  }
};

export const resetPasswordAction = async (formData: FormData) => {
  const rawData = {
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const { success, error, data } = ResetPasswordSchema.safeParse(rawData);
  if (!success) {
    const msg = error.issues[0].message;
    const path = error.issues[0].path[0];
    return {
      success: false,
      error: { [path]: msg },
    };
  }

  try {
    await auth.api.resetPassword({
      headers: await headers(),
      body: { newPassword: data.newPassword },
    });

    redirect("/sign-in");
  } catch (err) {
    if (err instanceof BetterAuthError) {
      return { success: false, error: err.message };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "Something went wrong. Please try again.",
    };
  }
};
