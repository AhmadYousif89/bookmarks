"use client";

import { CheckedState } from "@radix-ui/react-checkbox";
import { useUrlState } from "@/app/hooks/use-url-state";
import { useDashboard } from "../../dashboard.context";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SideSheetTags() {
  const { getParam, updateURL } = useUrlState();
  const { tags, loading } = useDashboard();

  const handleResetTags = () => {
    updateURL({ tags: null, page: null });
  };

  const selectedTags = getParam("tags")?.split(",") || [];

  const handleTagChange = (tag: string, checked: CheckedState) => {
    const currentTags = selectedTags;
    let updatedTags: string[];

    if (checked) {
      updatedTags = Array.from(new Set([...currentTags, tag]));
    } else {
      updatedTags = currentTags.filter((t) => t !== tag);
    }
    updateURL({ tags: updatedTags.length > 0 ? updatedTags.join(",") : null, page: "1" });
  };

  return (
    <div className="flex grow flex-col pb-4">
      <div className="flex min-h-6 justify-between pb-1">
        <span className="text-xs/normal font-bold text-[#4D4D4D] dark:text-[#CCD1D1]">TAGS</span>
        {selectedTags.length > 0 && (
          <Button
            variant="link"
            onClick={handleResetTags}
            className="h-5 w-fit p-0 text-xs font-semibold text-[#595454] underline decoration-[#D9D9D9] dark:text-[#CCD1D1]"
          >
            Reset
          </Button>
        )}
      </div>
      <ScrollArea className="h-[450px] lg:h-[800px]">
        <ul className="grow">
          {loading && tags.length === 0 ? (
            <SideTagsSkeleton />
          ) : tags.length === 0 ? (
            <p className="text-muted-foreground mt-4 text-center text-xs font-medium">
              No tags found. <br /> Your tags will appear here once you create a bookmark.
            </p>
          ) : (
            tags.map((tag) => {
              const isChecked = selectedTags.includes(tag.slug);
              return (
                <li key={tag.slug} className="px-3 py-0.5">
                  <div className="flex h-9.5 items-center justify-between rounded-sm py-2">
                    <div className="flex grow items-center gap-2">
                      <Checkbox
                        id={`tag-${tag.slug}`}
                        onCheckedChange={(checked) => handleTagChange(tag.slug, checked)}
                        checked={isChecked}
                      />
                      <Label
                        htmlFor={`tag-${tag.slug}`}
                        className="w-full cursor-pointer text-base leading-[140%] font-semibold"
                      >
                        {tag.name}
                      </Label>
                    </div>
                    <span className="bg-accent text-muted-foreground border-muted flex aspect-square size-5.5 items-center justify-center rounded-full border p-1 text-xs font-medium">
                      {tag.count}
                    </span>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </ScrollArea>
    </div>
  );
}

const SideTagsSkeleton = () => (
  <ScrollArea className="h-[450px] lg:h-[800px]">
    <div className="space-y-1">
      {Array.from({ length: 17 }).map((_, i) => (
        <div key={i} className="my-1 flex h-9 w-full items-center gap-2 rounded-md">
          <Skeleton className="size-5 rounded" />
          <Skeleton className="h-4 grow" />
          <Skeleton className="aspect-square size-6 rounded-full" />
        </div>
      ))}
    </div>
  </ScrollArea>
);
