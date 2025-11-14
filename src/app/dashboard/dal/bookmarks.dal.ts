import "server-only";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { cacheLife, cacheTag } from "next/cache";
import { FilterQuery, PipelineStage } from "mongoose";

import { Bookmark } from "@/lib/model";
import { TBookmark } from "@/lib/types";
import { auth } from "@/app/(auth)/lib/auth";
import { DashboardSearchParams } from "../_lib/search-params";
import { DB_PAGE_LIMIT } from "./user.data.dal";

type BookmarkFilterParams = {
  userId: string;
  isArchived: boolean;
  query?: string | null;
  tags?: string[] | null;
};

function buildBookmarkFilter({ userId, isArchived, query, tags }: BookmarkFilterParams) {
  const filter: { [k: string]: FilterQuery<BookmarkFilterParams> } = {
    $and: [{ userId: new ObjectId(userId) }],
  };

  filter.$and.push({ isArchived });

  if (query) {
    filter.$and.push({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { url: { $regex: query, $options: "i" } },
      ],
    });
  }

  if (tags && tags.length > 0) {
    filter.$and.push({ tags: { $in: tags } });
  }

  return filter;
}

// Returns counts only, respecting filters (query/tags). Ignores page/limit/sort.
export async function getBookmarkCounts(options?: DashboardSearchParams, userIdArg?: string) {
  const userId =
    userIdArg ?? ((await auth.api.getSession({ headers: await headers() }))?.user?.id || null);
  if (!userId) return { active: 0, archived: 0 };

  const base = { userId, query: options?.query, tags: options?.tags };

  const [active, archived] = await Promise.all([
    Bookmark.countDocuments(buildBookmarkFilter({ ...base, isArchived: false })).exec(),
    Bookmark.countDocuments(buildBookmarkFilter({ ...base, isArchived: true })).exec(),
  ]);

  return { active, archived };
}

export type BookmarksOpts = DashboardSearchParams & {
  userId: string;
  isArchived: boolean;
};

export type BookamrksResult = Awaited<ReturnType<typeof getBookmarks>>;
export async function getBookmarks(options: BookmarksOpts) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`[BOOKMARK]-${options.userId}`);

  const { userId, query, sort, tags, page = 1, limit = DB_PAGE_LIMIT, isArchived } = options;

  let sortOption: { [k: string]: 1 | -1 } = { pinned: -1, _id: 1 };
  if (sort) {
    switch (sort) {
      case "date:asc":
        sortOption = { createdAt: 1, _id: 1 };
        break;
      case "date:desc":
        sortOption = { createdAt: -1, _id: 1 };
        break;
      case "last-visit:desc":
        sortOption = { lastVisited: -1, _id: 1 };
        break;
      case "last-visit:asc":
        sortOption = { lastVisited: 1, _id: 1 };
        break;
      case "most-visited:asc":
        sortOption = { visitCount: 1, _id: 1 };
        break;
      case "most-visited:desc":
        sortOption = { visitCount: -1, _id: 1 };
        break;

      default:
        sortOption = { pinned: -1, _id: 1 };
    }
  }

  const safePage = page < 1 ? 1 : page;
  const skip = (safePage - 1) * limit;
  const filter = buildBookmarkFilter({ userId, isArchived, query, tags });
  const docs = await Bookmark.find(filter).sort(sortOption).skip(skip).limit(limit).exec();
  const data: TBookmark[] = docs.map((d) => {
    const json = d.toJSON();
    return {
      id: json._id.toString(),
      title: json.title,
      url: json.url,
      favicon: json.favicon,
      description: json.description,
      tags: json.tags,
      pinned: json.pinned,
      isArchived: json.isArchived,
      visitCount: json.visitCount,
      createdAt: json.createdAt?.toISOString() ?? null,
      updatedAt: json.updatedAt?.toISOString() ?? null,
      lastVisited: json.lastVisited,
    };
  });

  const total = await Bookmark.countDocuments(filter).exec();
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export type TagData = {
  slug: string;
  name: string;
  count: number;
};

type TagOpts = {
  isArchived?: boolean;
  query?: string | null;
  tags?: string[] | null;
};

export async function getBookmarkTags(userId: string, opts?: TagOpts) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`[BOOKMARK_TAGS]-${userId}`);

  const filter = { userId: new ObjectId(userId) };

  const pipeline: PipelineStage[] = [
    { $match: filter },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, slug: "$_id", name: "$_id", count: 1 } },
  ];

  return Bookmark.aggregate<TagData>(pipeline).exec();
}
