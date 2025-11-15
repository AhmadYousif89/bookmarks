"use client";

import { useActionState } from "react";

import { SignInDemoUser } from "../actions";
import { toastAction } from "@/components/toast-action";
import { ActionButton } from "@/components/action.button";

export const StartDemoButton = ({ isUser }: { isUser: boolean }) => {
  const [state, action, isPending] = useActionState(SignInDemoUser, undefined);

  return (
    <form action={action}>
      <ActionButton
        type={isUser ? "button" : "submit"}
        variant="secondary"
        disabled={isPending}
        isPending={isPending}
        className="sm:w-3xs"
        onClick={() => {
          if (isUser) toastAction("Please sign out of your current account to start the demo.");
        }}
      >
        Start Demo
      </ActionButton>
    </form>
  );
};
