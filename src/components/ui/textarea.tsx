import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        [
          "bg-input flex field-sizing-content min-h-22.75 w-full resize-none rounded-md p-3 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
          "dark:border-border-300 border-border-500 border",
          "placeholder:text-muted-foreground placeholder:text-sm",
        ],
        // Hover States
        "hover:bg-accent dark:hover:bg-muted dark:hover:border-border-400",
        // Focus States
        "focus-visible:border-ring focus-visible:ring-ring dark:focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2",
        // Invalid States
        "aria-invalid:border-destructive aria-invalid:ring-red-600 dark:aria-invalid:ring-red-800",
        // Disabled States
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
