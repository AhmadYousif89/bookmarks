import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base leading-1.5 font-semibold transition-all duration-150 outline-none cursor-pointer",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background",
    "aria-invalid:ring-(--red-600) aria-invalid:border-destructive dark:aria-invalid:ring-(--red-800)",
  ],
  {
    variants: {
      variant: {
        primary: [
          "h-11.5 w-42.25 p-0",
          "gradient-border-pseudo relative bg-teal-700 text-primary-foreground hover:bg-teal-800 active:scale-98 ease-in-out",
        ],
        destructive: [
          "h-11.5 w-42.25 px-3 py-2.5",
          "gradient-border-pseudo relative bg-destructive text-primary-foreground hover:bg-destructive/90 focus-visible:ring-destructive active:scale-98 ease-in-out",
          "dark:focus-visible:ring-destructive dark:focus-visible:ring-offset-foreground",
        ],
        secondary: [
          "bg-secondary text-secondary-foreground border-border dark:border-border-400 border-2 active:scale-98 ease-in-out",
          "dark:hover:bg-accent dark:focus-visible:border-(--neutral-dark-500) dark:active:border-(--neutral-dark-0) dark:active:bg-secondary",
          "focus-visible:border-border hover:bg-accent active:text-accent-foreground active:bg-secondary active:border-teal-700",
        ],
        ghost: "h-9.5 rounded-sm px-3 py-2 dark:hover:text-foreground",
        outline: "",
        link: "text-sm/tight font-semibold text-foreground p-0.5 decoration-current underline-offset-4 hover:text-primary hover:underline dark:hover:text-muted-foreground rounded-xs focus-visible:ring-ring dark:focus-visible:text-muted-foreground focus-visible:ring-2",
        navLink: [
          "w-full hover:bg-accent h-9.5 justify-start text-muted-foreground rounded-sm px-3 py-2",
          "focus-visible:bg-accent focus-visible:text-foreground group",
        ],
      },
      size: {
        default: "h-11.5 px-4 py-3",
        sm: "h-9 px-3",
        lg: "h-10 px-6",
        icon: "size-10",
        auto: "h-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
