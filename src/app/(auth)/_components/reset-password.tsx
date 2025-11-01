"use client";

import { AuthForm } from "./auth.form";
import { RESET_FIELDS } from "../lib/schema";
import { resetPasswordAction } from "../_actions";

export const ResetPasswordForm = () => {
  return (
    <AuthForm action={resetPasswordAction}>
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
