import { BookmarkSkeleton } from "./bookmark.skeleton";

export const BookmarkGridSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(336px,1fr))] gap-4 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <BookmarkSkeleton key={i} style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
};
