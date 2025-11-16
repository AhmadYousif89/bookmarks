import { z } from "zod";
import { titleCase } from "@/lib/utils";

export const BookmarkZodSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(280, "Description must be at most 280 characters"),
  url: z.string().trim().min(1, "URL is required"),
  tags: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((t) => titleCase(t.trim()))
        .filter(Boolean),
    )
    .refine((tags) => tags.length >= 1, "Minimum of 1 tag is required")
    .refine((tags) => tags.length <= 4, "Maximum of 4 tags is allowed")
    .refine((tags) => new Set(tags).size === tags.length, "Duplicate tags are not allowed"),
});
