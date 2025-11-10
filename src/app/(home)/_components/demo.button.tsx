"use client";

import { useActionState } from "react";

import { SignInDemoUser } from "../actions";
import { ActionButton } from "@/components/action.button";

export const StartDemoButton = () => {
  const [state, action, isPending] = useActionState(SignInDemoUser, undefined);
  return (
    <form action={action}>
      <ActionButton
        type="submit"
        size="default"
        variant="secondary"
        disabled={isPending}
        className="w-full sm:w-3xs"
      >
        Start Demo
      </ActionButton>
    </form>
  );
};
