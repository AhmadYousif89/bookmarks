import "server-only";

import { headers } from "next/headers";
import { auth } from "@/app/(auth)/lib/auth";
import { parseSearchParams } from "../_lib/search-params";
import {
  BookamrksResult,
  getBookmarkCounts,
  getBookmarkTags,
  getBookmarks,
  TagData,
} from "./bookmarks.dal";

export const DB_PAGE_LIMIT = 9;

type UserDataOptions = {
  params?: Record<string, string | string[] | undefined>;
  archived?: boolean;
  fetchBookmarks?: boolean;
  fetchBookmarkTags?: boolean;
  fetchBookmarkCounts?: boolean;
};

export async function getUserData({
  params = {},
  archived = false,
  fetchBookmarks = true,
  fetchBookmarkTags = false,
  fetchBookmarkCounts = false,
}: UserDataOptions) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id || null;

  if (!userId) {
    return { userId: null, bookmarks: null, tags: [], counts: { active: 0, archived: 0 } };
  }

  const parsedSP = parseSearchParams(params);

  let tags: TagData[] = [];
  let data: Partial<BookamrksResult> = {};
  let counts: { active: number; archived: number } = { active: 0, archived: 0 };
  if (fetchBookmarks) {
    data = await getBookmarks({ userId, ...parsedSP, isArchived: archived });
  }
  if (fetchBookmarkTags) {
    tags = await getBookmarkTags(userId, {
      isArchived: archived,
      query: parsedSP?.query || null,
      tags: parsedSP?.tags || null,
    });
  }
  if (fetchBookmarkCounts) {
    counts = await getBookmarkCounts(parsedSP, userId);
  }

  return { userId, bookmarks: data, tags, counts };
}
