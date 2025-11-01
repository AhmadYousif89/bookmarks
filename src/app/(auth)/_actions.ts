"use server";

import {
  SignInSchema,
  SignUpSchema,
  ForgetPasswordSchema,
  ResetPasswordSchema,
} from "./lib/schema";

export const signInAction = async (prevState: unknown, formData: FormData) => {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = SignInSchema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues[0].message;
    const path = result.error.issues[0].path[0];
    return { error: { [path]: [msg] } };
  }

  return { success: true, data: result.data, error: null };
};

export const signUpAction = async (prevState: unknown, formData: FormData) => {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = SignUpSchema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues[0].message;
    const path = result.error.issues[0].path[0];
    return { error: { [path]: [msg] } };
  }

  return { success: true, data: result.data, error: null };
};

export const forgetPasswordAction = async (prevState: unknown, formData: FormData) => {
  const data = {
    email: formData.get("email") as string,
  };

  const result = ForgetPasswordSchema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues[0].message;
    const path = result.error.issues[0].path[0];
    return { error: { [path]: [msg] } };
  }

  return { success: true, data: result.data, error: null };
};

export const resetPasswordAction = async (prevState: unknown, formData: FormData) => {
  const data = {
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = ResetPasswordSchema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues[0].message;
    const path = result.error.issues[0].path[0];
    return { error: { [path]: [msg] } };
  }

  return { success: true, data: result.data, error: null };
};
