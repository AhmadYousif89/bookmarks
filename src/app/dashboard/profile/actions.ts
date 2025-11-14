"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/app/(auth)/lib/auth";
import { uploadToCloudinary } from "./cloudinary";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password must be at least 8 characters long"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long")
      .max(30, "New password is too long"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";
export type FieldError = { path: PasswordField; message: string };

export async function updateUserPassword(formData: FormData) {
  const { success, data, error } = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  try {
    if (!success) {
      const errors: FieldError[] = error.issues.map((issue) => ({
        path: (issue.path?.[0] as PasswordField) ?? "currentPassword",
        message: issue.message,
      }));
      return { success: false, message: null, errors };
    }

    await auth.api.changePassword({
      body: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });

    return { success: true, message: "Password updated successfully", errors: [] };
  } catch (err) {
    const msg = (err as Error).message || "Failed to update password";
    return {
      success: false,
      message: null,
      errors: [{ path: "currentPassword", message: msg }],
    };
  }
}

export async function uploadUserAvatar(formData: FormData) {
  const file = formData.get("image") as File | null;

  if (!file || file.size === 0) {
    console.log({ file });
    return { success: false, message: "No file provided" };
  }

  try {
    const imageUrl = await uploadToCloudinary(file);
    if (!imageUrl) throw new Error("Image upload failed");
    await auth.api.updateUser({ body: { image: imageUrl }, headers: await headers() });
    return { success: true, imageUrl, message: "Image uploaded successfully" };
  } catch (err) {
    const msg = (err as Error).message || "Failed to upload image";
    return { success: false, message: msg };
  }
}
