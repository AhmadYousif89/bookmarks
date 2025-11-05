import { TagsList } from "./tags.client";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserData, getBookmarkTags } from "@/app/dashboard/dal/user.data.dal";

export async function SideSheetTags() {
  const { userId } = await getUserData();
  if (!userId) return null;

  const tags = await getBookmarkTags({ userId });

  if (tags.length === 0) {
    return (
      <p className="text-muted-foreground text-xs font-medium">
        No tags found. Start adding bookmarks with tags to see them listed here.
      </p>
    );
  }

  return <TagsList tags={tags} />;
}

export const SideTagsSkeleton = () => (
  <div className="flex grow flex-col px-3 pb-4">
    <div className="flex justify-between pt-1">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-16" />
    </div>
    <ScrollArea className="h-[450px] lg:h-[800px]">
      <div className="space-y-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="my-1 flex h-9 w-full items-center gap-2 rounded-md">
            <Skeleton className="size-5 rounded" />
            <Skeleton className="h-4 grow" />
            <Skeleton className="aspect-square size-6 rounded-full" />
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
);
