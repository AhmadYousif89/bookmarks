import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { AddBookmarkModal } from "../_components/create.modal";
import { BookmarkIcon } from "@/components/logo";
import { BookmarkCard } from "./bookmark.card";
import { TBookmark } from "@/lib/types";

type Props = {
  data: TBookmark[];
  hasQuery: boolean;
  hasTags: boolean;
  hasValidPage: boolean;
  isArchive?: boolean;
};

export const BookmarkContent = ({ data, hasQuery, hasTags, hasValidPage, isArchive }: Props) => {
  const hasData = data.length > 0;
  if ((hasQuery || hasTags || !hasValidPage) && !hasData) {
    return (
      <Empty className="bg-card my-auto min-h-80 grow-0 self-center">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon name="search" className="*:stroke-muted-foreground *:stroke-2" />
          </EmptyMedia>
          <EmptyTitle className="text-muted-foreground mb-2 text-lg font-semibold">
            {isArchive ? "No archived bookmarks found." : "No active bookmarks found"}
          </EmptyTitle>
          <EmptyDescription className="text-sm/tight font-medium">
            Try adjusting your search or filter to find what you're looking for.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (!hasData) {
    return (
      <Empty className="bg-card my-auto min-h-80 grow-0 self-center">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookmarkIcon />
          </EmptyMedia>
          <EmptyTitle className="text-muted-foreground mb-2 text-lg font-semibold">
            {isArchive ? "No archived bookmarks yet." : "No bookmarks yet."}
          </EmptyTitle>
          <EmptyDescription className="text-sm/tight font-medium">
            {isArchive
              ? "Your archived bookmarks will appear here once you've archived some."
              : "Start by adding your bookmarks and save your favorite links."}
          </EmptyDescription>
        </EmptyHeader>
        {!isArchive && <AddBookmarkModal hideBtnIcon />}
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(336px,1fr))] gap-4 md:gap-8">
      {data.map((bookmark, idx) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          style={{ animationDelay: `${idx * 0.1}s` }}
        />
      ))}
    </div>
  );
};
