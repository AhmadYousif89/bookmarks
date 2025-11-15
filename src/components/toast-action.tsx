"use client";

import { toast } from "sonner";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { AvailableIconNames } from "@/lib/icon.generated";

export const TOAST_LABELS = [
  "Bookmark added successfully.",
  "Changes saved.",
  "Link copied to clipboard.",
  "Bookmark pinned to top.",
  "Bookmark archived.",
  "Bookmark restored.",
  "Bookmark deleted.",
] as const;
export type ToastType = "success" | "error" | "info" | "warning";
export type ToastLabel = (typeof TOAST_LABELS)[number] | (string & {}); // allow custom strings
export type ToastAction = { label: ToastLabel; icon?: AvailableIconNames; type?: ToastType };

export const TOAST_ACTIONS: ToastAction[] = [
  { label: "Bookmark added successfully.", icon: "check", type: "success" },
  { label: "Changes saved.", icon: "check", type: "success" },
  { label: "Link copied to clipboard.", icon: "copy", type: "info" },
  { label: "Bookmark pinned to top.", icon: "pin", type: "info" },
  { label: "Bookmark archived.", icon: "archive", type: "info" },
  { label: "Bookmark restored.", icon: "unarchive", type: "info" },
  { label: "Bookmark deleted.", icon: "delete", type: "warning" },
] as const;

const byLabel = TOAST_ACTIONS.reduce(
  (acc, a) => {
    acc[a.label] = a;
    return acc;
  },
  {} as Record<ToastLabel, ToastAction>,
);

type ToastOptions = Parameters<typeof toast.success>[1];

export function toastAction(action: ToastAction, options?: ToastOptions): void;
export function toastAction(label: ToastLabel, options?: ToastOptions): void;
export function toastAction(input: ToastAction | ToastLabel, options?: ToastOptions) {
  let t: ToastAction;
  if (typeof input === "string") {
    t = byLabel[input] || { label: input };
  } else {
    t = input;
  }

  const toastFn = t.type ? toast[t.type] : toast.error;
  toastFn(t.label, {
    duration: 5000,
    classNames: {
      content: cn("text-foreground", t.type === "error" && "text-white"),
      toast: cn(
        "min-[600px]:w-md! min-[600px]:left-1/2 min-[600px]:-translate-x-1/2",
        t.type === "error" && "bg-red-600! text-white!",
      ),
    },
    icon: t.icon ? (
      <Icon
        name={t.icon}
        className={cn(
          "**:stroke-teal-700 dark:**:stroke-white",
          t.type === "error" && "**:stroke-white",
        )}
      />
    ) : null,
    action: (
      <div
        onClick={() => toast.dismiss()}
        className={cn(
          "text-muted-foreground ml-auto grid place-items-center rounded hover:bg-white hover:text-black",
          t.type === "error" && "bg-white dark:text-black",
        )}
      >
        <X className="size-5" />
      </div>
    ),
    ...options,
  });
}
