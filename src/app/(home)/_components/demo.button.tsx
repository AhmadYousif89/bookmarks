"use client";

import { useActionState } from "react";

import { SignInDemoUser } from "../actions";
import { toastAction } from "@/components/toast-action";
import { ActionButton } from "@/components/action.button";
import { useSession } from "@/app/(auth)/lib/auth.client";

export const StartDemoButton = () => {
  const [state, action, isPending] = useActionState(SignInDemoUser, undefined);
  const { data } = useSession();

  const isUser = data?.user.isDemo === false;

  return (
    <form action={action}>
      <ActionButton
        type={isUser ? "button" : "submit"}
        variant="secondary"
        disabled={isPending}
        isPending={isPending}
        className="w-full sm:w-3xs"
        onClick={() => {
          if (isUser) toastAction("Please sign out of your current account to start the demo.");
        }}
      >
        Start Demo
      </ActionButton>
    </form>
  );
};
