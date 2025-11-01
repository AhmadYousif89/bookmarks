import mongoose, { InferSchemaType } from "mongoose";
import { TBookmark } from "./types";
import { Model } from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    favicon: { type: String, default: "" },
    description: { type: String, default: "" },
    tags: { type: [String], default: [] },
    pinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    visitCount: { type: Number, default: 0 },
    lastVisited: { type: String, default: null },
  },
  { timestamps: true },
);

export type BookmarkDoc = InferSchemaType<typeof bookmarkSchema>;
export const Bookmark: Model<BookmarkDoc> =
  (mongoose.models.bookmarks as Model<BookmarkDoc>) ||
  mongoose.model<BookmarkDoc>("bookmarks", bookmarkSchema);
