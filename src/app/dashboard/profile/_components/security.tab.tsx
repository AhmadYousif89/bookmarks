"use client";

import Form from "next/form";
import { useActionState, useEffect, useState } from "react";

import { PasswordField, updateUserPassword } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionButton } from "@/components/action.button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

const initialState = {
  success: false,
  message: "",
  errors: [],
};

export function SecurityTab({ isDemo }: { isDemo: boolean }) {
  const [state, action, pending] = useActionState(updateUserPassword, initialState);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getErrorMsg = (field: PasswordField) => {
    return state.errors?.find((error) => error.path === field)?.message;
  };

  useEffect(() => {
    if (state.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [state]);

  return (
    <Card className="border-none p-5">
      <CardHeader className="bg-muted rounded-md py-4">
        <CardTitle>Change your password</CardTitle>
        <CardDescription>Update the password for your account </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form className="grid gap-4" action={action}>
          <fieldset className="grid gap-1">
            <Label className="text-muted-foreground text-xs font-bold" htmlFor="currentPassword">
              Current password
            </Label>
            <Input
              required
              id="currentPassword"
              name="currentPassword"
              type="password"
              className="border-border"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              aria-invalid={!!getErrorMsg("currentPassword")}
              aria-describedby="currentPassword-error"
            />
            {getErrorMsg("currentPassword") && (
              <p id="currentPassword-error" className="text-destructive mt-1 text-xs font-medium">
                {getErrorMsg("currentPassword")}
              </p>
            )}
          </fieldset>

          <fieldset className="grid gap-1">
            <Label className="text-muted-foreground text-xs font-bold" htmlFor="newPassword">
              New password
            </Label>
            <Input
              required
              id="newPassword"
              name="newPassword"
              type="password"
              className="border-border"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              aria-invalid={!!getErrorMsg("newPassword")}
              aria-describedby="newPassword-error"
            />
            {getErrorMsg("newPassword") && (
              <p id="newPassword-error" className="text-destructive mt-1 text-xs font-medium">
                {getErrorMsg("newPassword")}
              </p>
            )}
          </fieldset>

          <fieldset className="grid gap-1">
            <Label className="text-muted-foreground text-xs font-bold" htmlFor="confirmPassword">
              Confirm new password
            </Label>
            <Input
              required
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="border-border"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={!!getErrorMsg("confirmPassword")}
              aria-describedby="confirmPassword-error"
            />
            {getErrorMsg("confirmPassword") && (
              <p id="confirmPassword-error" className="text-destructive mt-1 text-xs font-medium">
                {getErrorMsg("confirmPassword")}
              </p>
            )}
          </fieldset>

          <CardFooter className="mt-4 gap-4 px-0">
            <ActionButton type="submit" disabled={isDemo || pending} className="text-sm">
              Update password
            </ActionButton>
            {state.success && (
              <p className="text-primary-foreground bg-primary rounded-md px-4 py-2 text-sm font-semibold">
                {state.message}
              </p>
            )}
          </CardFooter>
        </Form>
      </CardContent>
    </Card>
  );
}
