"use client";

import Form from "next/form";
import { useActionState, useEffect, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/action.button";
import { generateBookmarkMetadata, GeneratedAIData } from "../actions/generate-metadata";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import Image from "next/image";

type Props = {
  onSuccess?: (data: GeneratedAIData) => void;
  onError?: (error: string) => void;
  closeAiForm: () => void;
};

type FormState = {
  success: boolean;
  data?: GeneratedAIData;
  favicon?: string | null;
  error?: string;
  fieldError?: boolean;
};

const initialState: FormState = { success: false };

export const GenerateMetadataForm = ({ closeAiForm, onSuccess, onError }: Props) => {
  const [state, action, isPending] = useActionState(
    (pvState: FormState, data: FormData) => generateBookmarkMetadata(data),
    initialState,
  );
  const [localError, setLocalError] = useState("");

  const fieldErrorMsg = state.error && state.fieldError ? state.error : null;
  const value = state.success && state.data ? state.data.url : "";

  useEffect(() => {
    if (fieldErrorMsg) {
      setLocalError(fieldErrorMsg);
    } else {
      setLocalError("");
    }
  }, [fieldErrorMsg]);

  useEffect(() => {
    if (state.success && state.data) {
      onSuccess?.(state.data);
    } else if (state.error && !state.fieldError) {
      onError?.(state.error);
    }
  }, [state, onSuccess, onError]);

  const onClearError = () => {
    if (localError) setLocalError("");
  };

  return (
    <Form action={action} className="grid gap-8">
      <Field className="gap-1.5 *:[label]:w-fit">
        <FieldLabel htmlFor="ai-url" className="text-foreground gap-0.5 text-sm font-semibold">
          Website URL <span className="text-primary dark:text-muted-foreground">*</span>
        </FieldLabel>
        <InputGroup>
          <InputGroupInput
            required
            id="ai-url"
            name="url"
            autoComplete="off"
            placeholder="https://"
            onChange={onClearError}
            defaultValue={value}
            aria-invalid={localError ? "true" : undefined}
            aria-describedby={localError ? "url-error" : undefined}
          />
          {localError && (
            <InputGroupAddon align="block-end" className="border-t">
              <InputGroupButton
                type="button"
                variant="destructive"
                className="size-4 py-2"
                aria-label="Dismiss URL error"
                onClick={onClearError}
              >
                <Icon name="close" className="*:stroke-primary-foreground scale-75" />
              </InputGroupButton>
              <FieldError id="url-error" className="text-sm/normal font-medium tracking-tight">
                {fieldErrorMsg}
              </FieldError>
            </InputGroupAddon>
          )}
        </InputGroup>
      </Field>
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="secondary" onClick={closeAiForm}>
          Cancel
        </Button>
        <ActionButton type="submit" isPending={isPending} disabled={isPending}>
          Generate
        </ActionButton>
      </div>
    </Form>
  );
};
