"use client";

import { AuthForm } from "./auth.form";
import { forgetPasswordAction } from "../_actions";

export const ForgotPasswordForm = () => {
  return (
    <AuthForm action={forgetPasswordAction}>
      <AuthForm.Field label="Email" name="email" type="email" hint="*" />
      <AuthForm.SubmitButton>Send reset link</AuthForm.SubmitButton>
    </AuthForm>
  );
};
