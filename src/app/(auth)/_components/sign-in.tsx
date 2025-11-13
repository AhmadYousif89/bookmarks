"use client";

import { AuthForm } from "./auth.form";
import { signInAction } from "../_actions";
import { SIGNIN_FIELDS } from "../lib/schema";

export const SignInForm = () => {
  return (
    <AuthForm action={signInAction}>
      {SIGNIN_FIELDS.map((field) => (
        <AuthForm.Field key={field.name} label={field.label} name={field.name} type={field.type} />
      ))}
      <AuthForm.SubmitButton>Sign In</AuthForm.SubmitButton>
      <AuthForm.SendVerificationButton />
    </AuthForm>
  );
};
