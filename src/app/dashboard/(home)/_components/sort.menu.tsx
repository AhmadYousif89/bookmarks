"use client";

import { cn } from "@/lib/utils";
import { useUrlState } from "@/app/hooks/use-url-state";

import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortBy, sortMap } from "../../_lib/config";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const SortMenu = () => {
  const { getParam, updateURL } = useUrlState();
  const currentSort = getParam("sort");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="h-10.5 min-w-27 gap-1 px-3 py-2.5">
          <Icon name="sort" className="dark:*:stroke-primary-foreground" />
          Sort by
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="grid min-w-50 gap-1 p-2">
        {sortBy.map((item) => {
          const sortKey = sortMap[item].split(":")[0]; // like -> "date" from "date:asc"
          const [currentKey, currentDir] = currentSort ? currentSort.split(":") : [null, null];
          const isSelected = currentKey === sortKey;
          const dir = isSelected ? (currentDir === "asc" ? "asc" : "desc") : "desc"; // Preserve current direction or default to "desc"

          const handleSelect = () => {
            const nextDir = isSelected ? (currentDir === "desc" ? "asc" : "desc") : "desc"; // Toggle direction or default to "desc"
            updateURL({ sort: `${sortKey}:${nextDir}` });
          };

          return (
            <DropdownMenuItem
              key={item}
              onSelect={handleSelect}
              className={cn(
                "justify-between gap-2.5 p-2 font-semibold",
                isSelected && "bg-accent/50 font-medium text-black dark:text-white",
              )}
            >
              <span>{item}</span>
              {isSelected &&
                (dir === "asc" ? (
                  <ArrowUp className="text-current" />
                ) : (
                  <ArrowDown className="text-current" />
                ))}
            </DropdownMenuItem>
          );
        })}

        {currentSort && (
          <>
            <Separator className="my-1" />
            <DropdownMenuItem
              className="group justify-between p-2 font-semibold"
              onSelect={() => {
                updateURL({ sort: null });
              }}
            >
              Clear sort
              <Icon
                name="close"
                className="*:stroke-muted-foreground group-focus:*:stroke-foreground scale-90"
              />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
