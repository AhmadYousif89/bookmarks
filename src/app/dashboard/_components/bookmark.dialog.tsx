"use client";

import Form from "next/form";
import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { TBookmark } from "@/lib/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { toastAction } from "@/components/toast-action";
import { ActionButton } from "@/components/action.button";
import { FieldSet, FieldGroup } from "@/components/ui/field";
import { DescriptionTextarea } from "./description.textarea";
import { UrlInput } from "./url.input";
import { TagsInput } from "./tags.input";
import { TitleInput } from "./title.input";
import { useDashboard } from "../dashboard.context";
import { GeneratedAIData } from "../actions/generate-metadata";
import { GenerateMetadataForm } from "./generate-metadata.form";

export type FieldNames = "title" | "description" | "url" | "tags";
export type FieldErrorState = Partial<Record<FieldNames | "message", string>>;
export type FormState = {
  success: boolean;
  error?: FieldErrorState | null;
  data?: Record<Exclude<FieldNames, "tags">, string> & { tags: string[] };
};

type BookmarkModalProps = {
  actionFn: (data: FormData) => FormState | Promise<FormState>;
  defaultData?: TBookmark;
  hideBtnIcon?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const initialState: FormState = { success: false };

export const BookmarkModal = ({
  actionFn,
  defaultData,
  hideBtnIcon = false,
  open,
  onOpenChange,
}: BookmarkModalProps) => {
  const [state, action, isPending] = useActionState((prevState: FormState, data: FormData) => {
    return actionFn(data);
  }, initialState);

  const { refresh } = useDashboard();
  const formRef = useRef<HTMLFormElement>(null);
  const [localErrors, setLocalErrors] = useState<FieldErrorState | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [aiData, setAiData] = useState<GeneratedAIData | null>(null);

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  useEffect(() => {
    setLocalErrors(state.error ?? null);
  }, [state.error]);
  // Close and clear on success
  useEffect(() => {
    if (!state.success) return;

    formRef.current?.reset();
    setLocalErrors(null);
    setAiData(null);
    setShowUrlInput(false);
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setInternalOpen(false);
    }
    toastAction({
      label: defaultData ? "Changes saved." : "Bookmark added successfully.",
      icon: "check",
    });
    refresh?.(); // Refresh dashboard data api route (tags/counts)
  }, [state.success, defaultData, isControlled, onOpenChange, refresh]);
  // Show a toast for top-level errors (non-field)
  useEffect(() => {
    const message = state.error?.message;
    if (!message) return;
    toastAction(message);
  }, [state]);

  const isEdit = !!defaultData;
  const errorMessage = (path: FieldNames) => localErrors?.[path];
  const clearError = (path: FieldNames) =>
    setLocalErrors((prev) => (prev ? { ...prev, [path]: undefined } : prev));
  // Values to prefill after errors or for edit
  const values = useMemo(() => {
    return {
      title: aiData?.title ?? state.data?.title ?? defaultData?.title ?? "",
      description: aiData?.description ?? state.data?.description ?? defaultData?.description ?? "",
      url: aiData?.url ?? state.data?.url ?? defaultData?.url ?? "",
      tags: aiData?.tags ?? state.data?.tags ?? defaultData?.tags ?? [],
    };
  }, [state.data, defaultData, aiData]);

  // Remount field group when values change so uncontrolled inputs pick new defaults
  const valuesKey = useMemo(() => JSON.stringify(values), [values]);
  // Reset when dialog closes manually
  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        formRef.current?.reset();
        setLocalErrors(null);
        setAiData(null);
        setShowUrlInput(false);
      }
      if (isControlled) {
        onOpenChange?.(next);
      } else {
        setInternalOpen(next);
      }
    },
    [onOpenChange],
  );

  const handleAiFormClose = useCallback(() => {
    setShowUrlInput(false);
  }, []);

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      {!isEdit && ( // Only render trigger for add component
        <DialogTrigger asChild>
          {hideBtnIcon ? (
            <Button>Add Bookmark</Button>
          ) : (
            <Button className="max-sm:size-10">
              <Icon name="add" className="dark:*:stroke-foreground *:stroke-primary-foreground" />
              <span className="hidden sm:block">Add Bookmark</span>
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="bg-card gap-8 rounded-2xl px-5 py-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl leading-8.5 font-bold">
            {showUrlInput ? "Generate with AI" : isEdit ? "Edit Bookmark" : "Add Bookmark"}
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between gap-2">
            <span>
              {showUrlInput
                ? "Enter a URL to generate your bookmark's metadata using AI."
                : isEdit
                  ? "Update your saved link details — change the title, description, URL, or tags anytime."
                  : "Save a link with details to keep your collection organized."}
            </span>
            {!isEdit && !showUrlInput && (
              <Button variant="link" size="auto" onClick={() => setShowUrlInput(true)}>
                Try with AI 🤖
              </Button>
            )}
          </DialogDescription>
        </DialogHeader>
        {showUrlInput ? (
          <GenerateMetadataForm
            closeAiForm={handleAiFormClose}
            onSuccess={(data) => {
              setAiData(data);
              setShowUrlInput(false);
            }}
            onError={(err) => {
              toastAction(err);
            }}
          />
        ) : (
          <Form ref={formRef} action={action} className="grid gap-8">
            {aiData?.favicon && <input type="hidden" name="favicon" value={aiData.favicon} />}
            {isEdit && <input type="hidden" name="id" defaultValue={defaultData?.id} />}
            <FieldSet>
              <FieldGroup key={valuesKey} className="gap-5">
                <TitleInput
                  title={values.title}
                  error={!!errorMessage("title")}
                  errorMessage={errorMessage("title") || ""}
                  onClearError={() => clearError("title")}
                />
                <DescriptionTextarea
                  description={values.description}
                  error={!!errorMessage("description")}
                  errorMessage={errorMessage("description") || ""}
                  onClearError={() => clearError("description")}
                />
                <UrlInput
                  url={values.url}
                  favicon={aiData?.favicon || defaultData?.favicon}
                  error={!!errorMessage("url")}
                  errorMessage={errorMessage("url") || ""}
                  onClearError={() => clearError("url")}
                />
                <TagsInput
                  tags={values.tags}
                  error={!!errorMessage("tags")}
                  errorMessage={errorMessage("tags") || ""}
                  onClearError={() => clearError("tags")}
                />
              </FieldGroup>
            </FieldSet>
            <div className="flex items-center justify-end gap-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="h-11.5 w-22.5 px-4 py-3">
                  Cancel
                </Button>
              </DialogClose>
              <ActionButton type="submit" isPending={isPending} disabled={isPending}>
                {isEdit ? "Edit Bookmark" : "Add Bookmark"}
              </ActionButton>
            </div>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
