import { Skeleton } from "@/components/ui/skeleton";

export const BookmarkSkeleton = () => {
  return (
    <div className="bg-card grid min-h-[272px] overflow-hidden rounded-xl">
      {/* Header */}
      <div className="border-border flex items-center justify-between gap-3 border-b p-4">
        <Skeleton className="aspect-square size-10" />
        <div className="w-full space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <Skeleton className="aspect-square size-8" />
      </div>
      {/* Content */}
      <div className="space-y-4 p-4">
        <div className="space-y-1">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
      </div>
      {/* Footer */}
      <div className="border-border border-t py-3">
        <div className="flex items-center gap-3 px-4">
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-5 w-10" />
        </div>
      </div>
    </div>
  );
};
