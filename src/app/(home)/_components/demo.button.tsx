"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { SignInDemoUser } from "../actions";
import { toastAction } from "@/components/toast-action";
import { ActionButton } from "@/components/action.button";

export const StartDemoButton = ({ isUser }: { isUser: boolean }) => {
  const [state, action, isPending] = useActionState(SignInDemoUser, { success: false, error: "" });
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
    if (state?.error) {
      toastAction(state.error);
    }
  }, [state]);

  return (
    <form action={action} className="*:w-full">
      <ActionButton
        type={isUser ? "button" : "submit"}
        variant="secondary"
        disabled={isPending}
        isPending={isPending}
        onClick={() => {
          if (isUser) toastAction("Please sign out of your current account to start the demo.");
        }}
      >
        Start Demo
      </ActionButton>
    </form>
  );
};
