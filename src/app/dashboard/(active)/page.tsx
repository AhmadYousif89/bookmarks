import { Suspense } from "react";

import { DB_PAGE_LIMIT, getUserData } from "../dal/user.data.dal";
import { DashboardTitle } from "../_components/title.h1";
import { SortMenu } from "../_components/header/sort.menu";
import { BookmarksPanel } from "../_components/bookmark.panel";
import { BookmarkGridSkeleton } from "../_components/skeletons/grid.skeleton";

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const sp = await searchParams;
  const tags = Array.isArray(sp.tags)
    ? sp.tags.join()
    : typeof sp.tags === "string"
      ? sp.tags
      : null;
  const query = typeof sp.query === "string" ? sp.query : null;

  const { counts } = await getUserData({
    params: sp,
    fetchBookmarks: false,
    fetchBookmarkCounts: true,
  });
  const page = Number(sp.page) || 1;
  const totalFiltered = counts.active;
  const remainingItems = Math.max(0, totalFiltered - (page - 1) * DB_PAGE_LIMIT);
  const expectedCount = Math.min(DB_PAGE_LIMIT, remainingItems);

  return (
    <main className="flex grow flex-col">
      <section className="flex grow flex-col gap-5 p-4 pb-16 md:p-8 md:pb-16">
        <header className="flex items-start justify-between gap-2">
          <DashboardTitle headerTitle="All bookmarks" query={query} tags={tags} />
          {totalFiltered > 0 && <SortMenu />}
        </header>
        <Suspense fallback={<BookmarkGridSkeleton count={expectedCount} />}>
          <BookmarksPanel searchParams={sp} query={query} tags={tags} />
        </Suspense>
      </section>
    </main>
  );
}
