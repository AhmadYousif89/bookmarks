import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        [
          "bg-input h-11.25 min-h-9 w-full min-w-0 rounded-md p-3 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
          "border-border-500 dark:border-border-300 border",
          "placeholder:text-muted-foreground placeholder:text-sm",
          "selection:bg-primary selection:text-primary-foreground",
          "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        ],
        // Hover States
        "hover:bg-accent dark:hover:bg-input-500 dark:hover:border-border-400",
        // Focus States
        "focus-visible:border-ring focus-visible:ring-ring dark:focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2",
        // Invalid States
        "aria-invalid:border-destructive aria-invalid:ring-red-600 dark:aria-invalid:ring-red-800",
        // Disabled States
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
