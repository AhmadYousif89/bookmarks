"use server";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { updateTag } from "next/cache";

import { auth } from "@/app/(auth)/lib/auth";

import { Bookmark } from "@/lib/model";
import { normalizeUrl } from "@/lib/utils";
import connectToDatabase from "@/lib/db";
import { fetchFavicon } from "../_lib/util";
import { BookmarkZodSchema } from "../_lib/schema";
import type { FieldErrorState } from "../_components/bookmark.dialog";

export async function createBookmarkAction(formData: FormData) {
  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    url: formData.get("url") as string,
    tags: formData.get("tags") as string,
  };
  const precomputedFavicon = (formData.get("favicon") as string) || null;

  const { success, data, error } = BookmarkZodSchema.safeParse(rawData);
  const fields = {
    title: rawData.title ?? "",
    description: rawData.description ?? "",
    url: rawData.url ?? "",
    tags: (rawData.tags ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };

  try {
    if (!success) {
      const errors: FieldErrorState = {};
      error.issues.forEach((err) => {
        const path = err.path[0] as keyof typeof errors;
        errors[path] = err.message;
      });

      return { success: false, error: errors, data: fields };
    }

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    if (!userId) {
      return { success: false, error: { message: "Unauthorized" } };
    }

    const { title, description, url, tags } = data;
    const normalizedUrl = normalizeUrl(url);

    let favicon = precomputedFavicon;

    if (!favicon) {
      favicon = await fetchFavicon(normalizedUrl);
      if (!favicon) {
        favicon = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(
          normalizedUrl,
        )}&size=256`;
      }
    }

    await connectToDatabase();
    const result = await Bookmark.create({
      userId: new ObjectId(userId),
      title,
      description,
      url: normalizedUrl,
      tags,
      favicon,
    });

    if (!result) {
      throw new Error("Failed to create bookmark");
    }

    updateTag(`[BOOKMARK]-${userId}`);
    updateTag(`[BOOKMARK_TAGS]-${userId}`);
    return { success: true, error: null };
  } catch (err) {
    console.error("Error creating bookmark:", err);
    return {
      success: false,
      error: { message: err instanceof Error ? err.message : "Error creating bookmark" },
      data: fields,
    };
  }
}
