import { getUserData } from "../dal/user.data.dal";
import { BookmarkContent } from "./bookmark.content";
import { BookmarkPaginations } from "./bookmark.paginations";

type BookmarksPanelProps = {
  archived?: boolean;
  searchParams: Record<string, string | string[] | undefined>;
  query: string | null;
  tags: string | null;
};

export const BookmarksPanel = async ({
  archived,
  searchParams,
  query,
  tags,
}: BookmarksPanelProps) => {
  const { bookmarks } = await getUserData({ archived, params: searchParams, fetchBookmarks: true });
  const pageNum = bookmarks?.page || 1;
  const totalPages = bookmarks?.totalPages || 1;

  return (
    <>
      <BookmarkContent
        isArchive={archived}
        data={bookmarks?.data || []}
        hasQuery={!!query}
        hasTags={!!tags}
        hasValidPage={pageNum <= totalPages}
      />
      <BookmarkPaginations page={pageNum} totalPages={totalPages} />
    </>
  );
};
