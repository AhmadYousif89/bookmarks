"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { TBookmark } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

import { EditBookmarkModal } from "./edit.modal";
import { updateVisitCount } from "../actions/update";
import { BookmarkSettingsMenu } from "./bookmark-settings.menu";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkSkeleton } from "./skeletons/bookmark.skeleton";

export const BookmarkCard = ({ bookmark }: { bookmark: TBookmark }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleModalState = useCallback((open: boolean) => {
    setEditModalOpen(open);
  }, []);
  const handleSettingMenu = useCallback(() => setEditModalOpen(true), []);

  const handleVisitCount = async () => {
    await updateVisitCount(bookmark.id);
  };

  if (isPending) return <BookmarkSkeleton />;

  return (
    <>
      <article className="relative grid min-h-[272px]">
        <Card className="grow gap-4 border-none pt-4 pb-3">
          <div className="px-4">
            <CardHeader className="border-muted flex flex-row gap-3 border-b px-0">
              <Avatar className="size-11 rounded-md border">
                <AvatarImage
                  src={bookmark.favicon}
                  alt={`${bookmark.title} Favicon`}
                  className={cn(
                    bookmark.title.toLowerCase().includes("github") && "dark:mix-blend-overlay",
                  )}
                />
                <AvatarFallback className="rounded" />
              </Avatar>
              <div className="flex flex-col gap-1 truncate">
                <CardTitle title={bookmark.title} className="truncate text-lg font-bold">
                  {bookmark.title}
                </CardTitle>
                <Button
                  asChild
                  variant="ghost"
                  onClick={handleVisitCount}
                  className="text-muted-foreground h-auto w-fit truncate rounded-none p-0 text-left text-xs font-medium focus-visible:border-none focus-visible:ring focus-visible:ring-offset-0"
                >
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={bookmark.url}
                    title={bookmark.url}
                    className="hover:text-primary dark:hover:text-primary-foreground hover:underline hover:underline-offset-2"
                  >
                    {bookmark.url}
                  </Link>
                </Button>
              </div>
              <BookmarkSettingsMenu
                bookmark={bookmark}
                onEdit={handleSettingMenu}
                setPending={setIsPending}
                isPending={isPending}
              />
            </CardHeader>
          </div>
          <CardContent className="text-muted-foreground grid grow gap-4 px-4">
            <p className="text-sm/normal font-medium">{bookmark.description}</p>
            <div className="flex flex-nowrap items-center gap-1 overflow-x-auto">
              {bookmark.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-accent rounded p-1 text-xs leading-3.5 font-medium whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
          <Separator className="border-border" />
          <CardFooter className="gap-4 px-4">
            <Tooltip>
              <TooltipTrigger asChild className="flex items-center gap-1.5">
                <div>
                  <Icon name="visit-count" className="*:stroke-muted-foreground scale-75" />
                  <span className="text-muted-foreground text-xs font-medium">
                    {bookmark.visitCount}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <span>Visit Count: </span>
                {bookmark.visitCount}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild className="flex items-center gap-1.5">
                <div>
                  <Icon name="last-visited" className="**:stroke-muted-foreground scale-75" />
                  <span className="text-muted-foreground text-xs font-medium">
                    {bookmark.lastVisited ? formatRelativeOrShort(bookmark.lastVisited) : "----"}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <span>Last Visited: </span>
                {bookmark.lastVisited ? formatDate(bookmark.lastVisited) : "----"}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild className="flex items-center gap-1.5">
                <div>
                  <Icon name="created" className="*:stroke-muted-foreground scale-75" />
                  <span className="text-muted-foreground text-xs font-medium">
                    {bookmark.createdAt ? formatRelativeOrShort(bookmark.createdAt) : "----"}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <span>Created At: </span>
                {bookmark.createdAt ? formatDate(bookmark.createdAt) : "----"}
              </TooltipContent>
            </Tooltip>

            {bookmark.isArchived && (
              <span className="bg-accent text-muted-foreground ml-auto rounded p-1 text-xs font-medium">
                Archived
              </span>
            )}
            {bookmark.pinned && (
              <Tooltip>
                <TooltipTrigger asChild className="ml-auto">
                  <Icon name="pin" className="*:stroke-muted-foreground scale-75" />
                </TooltipTrigger>
                <TooltipContent>Pinned</TooltipContent>
              </Tooltip>
            )}
          </CardFooter>
        </Card>
      </article>

      <EditBookmarkModal bookmark={bookmark} open={editModalOpen} onOpenChange={handleModalState} />
    </>
  );
};

function formatRelativeOrShort(dateStr?: string | Date) {
  if (!dateStr) return "----";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "----";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} h${diffHours === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
