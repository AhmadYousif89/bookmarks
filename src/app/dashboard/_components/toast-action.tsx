"use client";

import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { TOAST_ACTIONS, type ToastAction, type ToastLabel } from "../_lib/config";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

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
