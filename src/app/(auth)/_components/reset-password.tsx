"use client";

import { useCallback } from "react";
import { redirect, useSearchParams } from "next/navigation";

import { AuthForm } from "./auth.form";
import { RESET_FIELDS } from "../lib/schema";
import { resetPasswordAction } from "../_actions";

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const sendResetAction = async (data: FormData) => resetPasswordAction(data, token);
  const onSuccess = useCallback(() => redirect("/sign-in"), []);

  return (
    <AuthForm action={sendResetAction} onSuccess={onSuccess}>
      {RESET_FIELDS.map((field) => (
        <AuthForm.Field
          key={field.name}
          label={field.label}
          name={field.name}
          type={field.type}
          hint="*"
        />
      ))}
      <AuthForm.SubmitButton>Reset Password</AuthForm.SubmitButton>
    </AuthForm>
  );
};
