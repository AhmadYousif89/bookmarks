"use client";

import { AuthForm } from "./auth.form";
import { signUpAction } from "../_actions";
import { SIGNUP_FIELDS } from "../lib/schema";

export const SignUpForm = () => {
  return (
    <AuthForm action={signUpAction}>
      {SIGNUP_FIELDS.map((field) => (
        <AuthForm.Field
          key={field.name}
          label={field.label}
          name={field.name}
          type={field.type}
          hint="*"
        />
      ))}
      <AuthForm.SubmitButton>Create Account</AuthForm.SubmitButton>
    </AuthForm>
  );
};
