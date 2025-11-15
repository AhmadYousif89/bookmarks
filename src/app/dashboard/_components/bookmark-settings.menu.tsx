"use client";

import { Fragment, memo, Suspense } from "react";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TBookmark } from "@/lib/types";
import { AvailableIconNames } from "@/lib/icon.generated";
import { Item, ItemLabel, ItemLabelKeys, ITEMS } from "../_lib/config";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionButton } from "@/components/action.button";
import {
  updateBookmarkArchiveStatus,
  updateBookmarkPinStatus,
  updateVisitCount,
} from "../actions/update";
import { toastAction } from "./toast-action";
import { deleteBookmarkAction } from "../actions/delete";
import { useDashboard } from "../dashboard.context";

const visibilityMap: Record<ItemLabelKeys, (bookmark: TBookmark) => boolean> = {
  Visit: () => true,
  "Copy URL": () => true,
  Pin: (b) => !b.pinned && !b.isArchived,
  Unpin: (b) => b.pinned && !b.isArchived,
  Edit: (b) => !b.isArchived,
  Archive: (b) => !b.isArchived,
  Unarchive: (b) => b.isArchived,
  "Delete Permanently": (b) => b.isArchived,
};

const shouldShowItem = (item: Item, bookmark: TBookmark): boolean => {
  return visibilityMap[item.label]?.(bookmark) ?? false;
};

type Props = {
  bookmark: TBookmark;
  onEdit?: (bookmark: TBookmark) => void;
  setPending: (state: boolean) => void;
  isPending: boolean;
};

export const BookmarkSettingsMenu = memo(({ bookmark, onEdit, isPending, setPending }: Props) => {
  const { refresh } = useDashboard();

  const handleVisits = async (b: TBookmark) => {
    const res = await updateVisitCount(b.id);
    if (res.success) window.open(b.url, "_blank");
    else toast.error(res.error?.message || "Failed to visit bookmark");
  };

  const handlePinState = async (bookmarkId: string) => {
    setPending(true);
    const res = await updateBookmarkPinStatus(bookmarkId);
    if (res.success) {
      refresh?.();
      toastAction({
        label: `Bookmark ${res.state === "pinned" ? "pinned to top." : "unpinned"}`,
        icon: res.state === "pinned" ? "pin" : "unpin",
      });
    } else {
      toast.error(
        res.error?.message || `Failed to ${res.state === "pinned" ? "pin" : "unpin"} bookmark`,
      );
    }
    setPending(false);
  };

  const handleArchiveState = async (bookmarkId: string) => {
    setPending(true);
    const res = await updateBookmarkArchiveStatus(bookmarkId);
    if (res.success) {
      refresh?.();
      toastAction({
        label: `Bookmark ${res.state === "archived" ? "archived" : "restored"}.`,
        icon: res.state === "archived" ? "archive" : "unarchive",
      });
    } else {
      toast.error(
        res.error?.message ||
          `Failed to ${res.state === "archived" ? "archive" : "restore"} bookmark`,
      );
    }
    setPending(false);
  };

  const handleDelete = async (id: string) => {
    setPending(true);
    const res = await deleteBookmarkAction(id);
    if (res.success) {
      refresh?.();
      toastAction("Bookmark deleted.");
    } else {
      toast.error(res.error?.message);
    }
    setPending(false);
  };

  const actionMap: Record<
    ItemLabelKeys,
    (bookmark: TBookmark, onEdit?: (bookmark: TBookmark) => void) => void
  > = {
    Visit: (b) => handleVisits(b),
    "Copy URL": (b) => handleCopy(b.url),
    Pin: (b) => handlePinState(b.id),
    Unpin: (b) => handlePinState(b.id),
    Edit: (b, onEdit) => onEdit?.(b),
    Archive: (b) => handleArchiveState(b.id),
    Unarchive: (b) => handleArchiveState(b.id),
    "Delete Permanently": (b) => handleDelete(b.id),
  };

  const handleAction = (label: ItemLabel) => {
    if (onEdit) actionMap[label](bookmark, onEdit);
    else actionMap[label](bookmark);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="ml-auto size-8">
        <Button variant="secondary">
          <Icon name="menu-bookmark" className="dark:*:stroke-primary-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-50 p-2">
        {ITEMS.map((item) => {
          if (!shouldShowItem(item, bookmark)) {
            return null;
          }
          const requireUserAction =
            item.label === "Archive" ||
            item.label === "Unarchive" ||
            item.label === "Delete Permanently";

          return (
            <Fragment key={item.label}>
              {requireUserAction ? (
                <ItemWithAlert
                  disabled={isPending}
                  label={item.label}
                  iconName={item.icon}
                  isPinned={bookmark.pinned}
                  actionFn={() => handleAction(item.label)}
                />
              ) : (
                <DropdownMenuItem
                  disabled={isPending}
                  onSelect={() => handleAction(item.label)}
                  className="group mb-1 gap-2.5 p-2 last:mb-0"
                >
                  <span className="size-4">
                    <Icon
                      name={item.icon}
                      className="**:stroke-muted-foreground group-focus:**:stroke-foreground dark:group-focus:**:stroke-foreground scale-80"
                    />
                  </span>
                  <span className="text-muted-foreground group-focus:text-foreground text-sm font-semibold">
                    {item.label}
                  </span>
                </DropdownMenuItem>
              )}
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

BookmarkSettingsMenu.displayName = "BookmarkSettingsMenu";

type ItemWithAlertProps = {
  disabled: boolean;
  iconName: AvailableIconNames;
  label: ItemLabel;
  actionFn: () => void;
  isPinned?: boolean;
};

type AlertKey = Exclude<ItemLabel, "Visit" | "Copy URL" | "Edit" | "Pin" | "Unpin">;
type Meta = Record<
  AlertKey,
  {
    title: "Archive bookmark" | "Restore bookmark" | "Delete bookmark permanently";
    description: (isPinned?: boolean) => string;
    actionTitle: AlertKey;
  }
>;
const ItemWithAlert = ({ iconName, label, actionFn, isPinned, disabled }: ItemWithAlertProps) => {
  const meta: Meta = {
    Archive: {
      title: "Archive bookmark",
      description: (pinned?: boolean) =>
        pinned
          ? "Are you sure you want to archive this bookmark? Archiving will unpin the bookmark and remove it from the active list."
          : "Are you sure you want to archive this bookmark?",
      actionTitle: "Archive",
    },
    Unarchive: {
      title: "Restore bookmark",
      description: () => "Move this bookmark back to the active list.",
      actionTitle: "Unarchive",
    },
    "Delete Permanently": {
      title: "Delete bookmark permanently",
      description: () =>
        "This action cannot be undone. Are you sure you want to delete this bookmark permanently?",
      actionTitle: "Delete Permanently",
    },
  };

  const confirmVariant = label === "Delete Permanently" ? "destructive" : "primary";
  const confirmOpts = {
    title: meta[label as AlertKey].title,
    description: meta[label as AlertKey].description(isPinned),
    actionText: meta[label as AlertKey].actionTitle,
    buttonProps: { variant: confirmVariant } as const,
  };

  return (
    <DropdownMenuItem
      asChild
      disabled={disabled}
      onSelect={(e) => e.preventDefault()}
      className="group mb-1 gap-2.5 p-0 last:mb-0"
    >
      <ActionButton
        variant="outline"
        className={cn(
          "h-auto w-full justify-start gap-2 border-0 p-2 ring-0",
          "focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0",
        )}
        confirm={confirmOpts}
        onAction={actionFn}
      >
        <span className="size-4">
          <Icon
            name={iconName}
            className="**:stroke-muted-foreground group-focus:**:stroke-foreground dark:group-focus:**:stroke-foreground scale-80"
          />
        </span>
        <span className="text-muted-foreground group-focus:text-foreground text-sm font-semibold">
          {label}
        </span>
      </ActionButton>
    </DropdownMenuItem>
  );
};

function handleCopy(url: string) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(url)
      .then(() => toastAction("Link copied to clipboard."))
      .catch(() => fallbackCopy(url));
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(text: string) {
  const input = document.createElement("input");
  input.value = text;
  input.readOnly = true;
  input.style.position = "fixed";
  input.style.opacity = "0";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(input);
  ok ? toastAction("Link copied to clipboard.") : toast.error("Copy failed");
}
