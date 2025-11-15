"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Spinner } from "./ui/spinner";
import { Button, buttonVariants } from "./ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

export type ConfirmOptions = {
  title?: string;
  description?: string;
  actionText?: string;
  buttonProps?: Pick<ButtonProps, "variant" | "size" | "className">;
};

type Props = {
  isPending?: boolean;
  confirm?: ConfirmOptions; // if provided, shows alert dialog
  onAction?: () => void; // action to perform on confirm
  onClick?: ButtonProps["onClick"];
} & Omit<ButtonProps, "onClick">;

export const ActionButton = ({
  className,
  children,
  isPending,
  confirm,
  onAction,
  onClick,
  variant,
  size,
  ...props
}: Props) => {
  const { pending } = useFormStatus();
  const isLoading = pending || isPending || false;

  const trigger = (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("relative", className, isLoading && "pointer-events-none")}
      {...props}
      onClick={(e) => {
        // prevent DropdownMenuItem onSelect from firing when we want dialog
        if (confirm) e.stopPropagation();
        onClick?.(e);
      }}
    >
      <BtnContent isLoading={isLoading}>{children}</BtnContent>
    </Button>
  );

  if (!confirm) return trigger;

  const {
    title = "Are you sure?",
    description = "This action cannot be undone.",
    actionText = "Confirm",
    buttonProps,
  } = confirm;
  const actionVariant = buttonProps?.variant ?? "destructive";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="bg-card border-none">
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <AlertDialogFooter className="flex-row">
          <AlertDialogCancel asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="button"
              onClick={() => onAction?.()}
              className={cn(
                buttonVariants({ variant: actionVariant, size: buttonProps?.size }),
                "w-auto",
                buttonProps?.className,
              )}
            >
              <BtnContent isLoading={isLoading}>{actionText}</BtnContent>
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const BtnContent = ({ children, isLoading }: { isLoading: boolean; children: React.ReactNode }) => (
  <>
    <Spinner
      className={cn(
        "absolute inset-0 m-auto size-6 opacity-0 transition-opacity duration-150 ease-out",
        isLoading ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0",
      )}
    />
    <span
      className={cn(
        "inline-flex items-center justify-between gap-2 transition-opacity duration-150",
        isLoading ? "invisible scale-0 opacity-0" : "visible scale-100 opacity-100",
      )}
    >
      {children}
    </span>
  </>
);
