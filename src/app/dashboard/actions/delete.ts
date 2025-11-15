"use server";

import { ObjectId } from "mongodb";
import { updateTag } from "next/cache";

import { Bookmark } from "@/lib/model";
import connectToDatabase from "@/lib/db";

export async function deleteBookmarkAction(bookmarkId: string) {
  if (!bookmarkId || !ObjectId.isValid(bookmarkId)) {
    throw new Error("Invalid bookmark ID");
  }

  try {
    await connectToDatabase();
    const existing = await Bookmark.findById(new ObjectId(bookmarkId)).lean();
    if (!existing) {
      throw new Error("Bookmark not found or already deleted");
    }

    const result = await Bookmark.deleteOne({ _id: new ObjectId(bookmarkId) }).exec();
    if (result.deletedCount === 0) {
      throw new Error("Bookmark not found or already deleted");
    }

    const uid = existing.userId.toString();
    updateTag(`[BOOKMARK]-${uid}`);
    updateTag(`[BOOKMARK_TAGS]-${uid}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete bookmark:", error);
    return {
      success: false,
      error: { message: (error as Error).message || "Failed to delete bookmark" },
    };
  }
}
