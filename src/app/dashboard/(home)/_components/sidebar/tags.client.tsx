"use client";

import { CheckedState } from "@radix-ui/react-checkbox";
import { useUrlState } from "@/app/hooks/use-url-state";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

type TagItem = {
  slug: string;
  name: string;
  count: number;
};

export function TagsList({ tags }: { tags: TagItem[] }) {
  const { getParam, updateURL } = useUrlState();

  const handleResetTags = () => {
    updateURL({ tags: null });
  };

  const selectedTags = getParam("tags")?.split(",") || [];

  const handleTagChange = (tag: string, checked: CheckedState) => {
    const currentTags = selectedTags;
    let newTags: string[];

    if (checked) {
      newTags = Array.from(new Set([...currentTags, tag]));
    } else {
      newTags = currentTags.filter((t) => t !== tag);
    }
    updateURL({ tags: newTags.length > 0 ? newTags.join(",") : null });
  };

  return (
    <div className="flex grow flex-col pb-4">
      <div className="flex min-h-6 justify-between pb-1">
        <span className="text-xs/normal font-bold text-[#4D4D4D] dark:text-[#CCD1D1]">TAGS</span>
        {selectedTags.length > 0 && (
          <Button
            variant="link"
            onClick={handleResetTags}
            className="h-5 w-fit text-xs font-semibold text-[#595454] underline decoration-[#D9D9D9] dark:text-[#CCD1D1]"
          >
            Reset
          </Button>
        )}
      </div>
      <ScrollArea className="h-[450px] lg:h-[800px]">
        <ul className="grow">
          {tags.map((tag) => {
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
          })}
        </ul>
      </ScrollArea>
    </div>
  );
}
