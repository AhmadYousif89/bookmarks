"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-border-500 data-[state=checked]:text-primary-foreground data-[state=checked]:border-border-300 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive focus-visible:ring-offset-card size-4 shrink-0 rounded border shadow-xs transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-(--red-600) data-[state=checked]:bg-(--teal-700) data-[state=checked]:hover:bg-(--teal-800) dark:aria-invalid:ring-(--red-800)",
        "hover:bg-accent dark:focus-visible:ring-offset-background dark:focus-visible:bg-primary dark:focus-visible:border-sidebar-border dark:data-[state=checked]:focus-visible:bg-(--teal-700)",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
