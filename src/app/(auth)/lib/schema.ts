import z from "zod";
import { FieldProps } from "./types";

export const SIGNIN_FIELDS: FieldProps[] = [
  { label: "Email", type: "email", name: "email" },
  { label: "Password", type: "password", name: "password" },
] as const;

export const SignInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email cannot be empty")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z
    .string()
    .trim()
    .min(1, "Password cannot be empty")
    .min(8, "Password must be at least 8 characters"),
});

export type SignInData = z.infer<typeof SignInSchema>;

// Sign Up

export const SIGNUP_FIELDS: FieldProps[] = [
  { label: "Name", type: "text", name: "name" },
  { label: "Email", type: "email", name: "email" },
  {
    label: "Create Password",
    type: "password",
    name: "password",
    hint: "Passwords must be at least 8 characters",
  },
];

export const SignUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must be at most 30 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email cannot be empty")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z
    .string()
    .trim()
    .min(1, "Password cannot be empty")
    .min(8, "Passwords must be at least 8 characters")
    .max(30, "Password must be at most 30 characters"),
});

export type SignUpData = z.infer<typeof SignUpSchema>;

// Forget Password

export const ForgetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email cannot be empty")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
});

export type ForgetPasswordData = z.infer<typeof ForgetPasswordSchema>;

// Reset Password

export const RESET_FIELDS: FieldProps[] = [
  { label: "New Password", type: "password", name: "newPassword" },
  { label: "Confirm Password", type: "password", name: "confirmPassword" },
] as const;

export const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(1, "Password cannot be empty")
      .min(8, "Passwords must be at least 8 characters")
      .max(30, "Password must be at most 30 characters"),
    confirmPassword: z.string().trim().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
  });

export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;
