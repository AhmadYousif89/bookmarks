"use server";

import { ObjectId } from "mongodb";
import { updateTag } from "next/cache";

import { Bookmark } from "@/lib/model";
import { normalizeUrl } from "@/lib/utils";
import connectToDatabase from "@/lib/db";
import { fetchFavicon } from "../_lib/util";
import { BookmarkZodSchema } from "../_lib/schema";
import type { FieldErrorState } from "../_components/bookmark.dialog";

function bookmarkKey(userId: string) {
  return `[BOOKMARK]-${userId}`;
}
function bookmarkTagsKey(userId: string) {
  return `[BOOKMARK_TAGS]-${userId}`;
}

export async function editBookmarkAction(formData: FormData) {
  const rawData = {
    id: (formData.get("id") as string) || "",
    title: (formData.get("title") as string) || "",
    description: (formData.get("description") as string) || "",
    url: (formData.get("url") as string) || "",
    tags: (formData.get("tags") as string) || "",
  };

  const fields = {
    title: rawData.title,
    description: rawData.description,
    url: rawData.url,
    tags: rawData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };

  if (!rawData.id || !ObjectId.isValid(rawData.id)) {
    return {
      success: false,
      error: { message: "Invalid bookmark ID" },
      data: fields,
    };
  }

  const { success, data, error } = BookmarkZodSchema.safeParse({
    title: rawData.title,
    description: rawData.description,
    url: rawData.url,
    tags: rawData.tags,
  });

  if (!success) {
    const errors: FieldErrorState = {};
    error.issues.forEach((err) => {
      const path = err.path[0] as keyof FieldErrorState;
      errors[path] = err.message;
    });
    return { success: false, error: errors, data: fields };
  }

  try {
    const { title, description, url, tags } = data;
    const normalizedUrl = normalizeUrl(url);

    await connectToDatabase();
    const bookmarkId = new ObjectId(rawData.id);

    const exDocData = await Bookmark.findById(bookmarkId).lean();
    if (!exDocData) {
      throw new Error("Bookmark not found");
    }

    const dataHasChanged = checkDocChanges(exDocData, {
      title,
      description,
      url: normalizedUrl,
      tags,
    });

    // Detect tag changes specifically for tag cache invalidation
    const tagsHaveChanged = (() => {
      const a = new Set(exDocData.tags);
      const b = new Set(tags);
      if (a.size !== b.size) return true;
      for (const t of a) if (!b.has(t)) return true;
      return false;
    })();

    if (!dataHasChanged) {
      return { success: true, error: null, data: fields };
    }

    // Fetch favicon only when URL changes
    let updateData: Partial<{
      title: string;
      description: string;
      url: string;
      tags: string[];
      favicon: string;
    }> = { title, description, url: normalizedUrl, tags };

    if (exDocData.url !== normalizedUrl) {
      let favicon = await fetchFavicon(normalizedUrl);
      if (!favicon) {
        favicon = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(
          normalizedUrl,
        )}&size=256`;
      }
      updateData.favicon = favicon;
    }

    await Bookmark.updateOne({ _id: bookmarkId }, { $set: updateData });

    const uid = exDocData.userId.toString();
    updateTag(bookmarkKey(uid));
    if (tagsHaveChanged) {
      updateTag(bookmarkTagsKey(uid));
    }
    return { success: true, error: null, data: fields };
  } catch (err) {
    console.error("Bookmark update failed:", err);
    return {
      success: false,
      error: { message: (err as Error).message || "Bookmark update failed" },
      data: fields,
    };
  }
}

function checkDocChanges(
  existingData: { title: string; description: string; url: string; tags: string[] },
  newData: { title: string; description: string; url: string; tags: string[] },
): boolean {
  if (
    existingData.title !== newData.title ||
    existingData.description !== newData.description ||
    existingData.url !== newData.url
  )
    return true;

  const existingTagsSet = new Set(existingData.tags);
  const newTagsSet = new Set(newData.tags);

  if (existingTagsSet.size !== newTagsSet.size) return true;

  for (const tag of existingTagsSet) {
    if (!newTagsSet.has(tag)) return true;
  }
  return false;
}

export async function updateVisitCount(bookmarkId: string) {
  if (!ObjectId.isValid(bookmarkId)) {
    throw new Error("Invalid bookmark ID");
  }

  try {
    await connectToDatabase();
    const doc = await Bookmark.findById(new ObjectId(bookmarkId)).exec();
    if (!doc) {
      throw new Error("Bookmark not found");
    }

    doc.visitCount = (doc.visitCount || 0) + 1;
    doc.lastVisited = new Date().toISOString();
    await doc.save();

    const uid = doc.userId.toString();
    updateTag(bookmarkKey(uid));
    return { success: true };
  } catch (error) {
    console.error("Failed to update visit count:", error);
    return {
      success: false,
      error: { message: (error as Error).message || "Failed to update visit count" },
    };
  }
}

export async function updateBookmarkPinStatus(bookmarkId: string) {
  if (!ObjectId.isValid(bookmarkId)) {
    throw new Error("Invalid bookmark ID");
  }

  try {
    await connectToDatabase();
    const doc = await Bookmark.findById(new ObjectId(bookmarkId)).exec();
    if (!doc) {
      throw new Error("Bookmark not found");
    }

    doc.pinned = !doc.pinned;
    await doc.save();

    const uid = doc.userId.toString();
    updateTag(bookmarkKey(uid));
    return { success: true, state: doc.pinned ? "pinned" : "unpinned" } as const;
  } catch (error) {
    console.error("Failed to update pin status:", error);
    return {
      success: false,
      error: { message: (error as Error).message || "Failed to update pin status" },
    };
  }
}

export async function updateBookmarkArchiveStatus(bookmarkId: string) {
  if (!ObjectId.isValid(bookmarkId)) {
    throw new Error("Invalid bookmark ID");
  }

  try {
    await connectToDatabase();
    const doc = await Bookmark.findById(new ObjectId(bookmarkId)).exec();
    if (!doc) {
      throw new Error("Bookmark not found");
    }

    if (!doc.isArchived) {
      doc.pinned = false; // Unpin when archiving
      doc.isArchived = true;
    } else {
      doc.isArchived = false;
    }
    await doc.save();

    const uid = doc.userId.toString();
    updateTag(bookmarkKey(uid));
    return { success: true, state: doc.isArchived ? "archived" : "restored" } as const;
  } catch (error) {
    console.error("Failed to update archive status:", error);
    return {
      success: false,
      error: { message: (error as Error).message || "Failed to update archive status" },
    };
  }
}
