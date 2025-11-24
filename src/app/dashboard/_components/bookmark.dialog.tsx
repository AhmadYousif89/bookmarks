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
import { useSession } from "@/app/(auth)/lib/auth.client";
import { UserLockIcon } from "@/components/user-lock";

type FieldNames = "title" | "description" | "url" | "tags";
export type FieldErrorState = Partial<Record<FieldNames | "message", string>>;
type FormState = {
  success: boolean;
  error?: FieldErrorState | null;
  data?: Record<Exclude<FieldNames, "tags">, string> & { tags: string[] };
  submissionId?: number;
};

type BookmarkModalProps = {
  actionFn: (data: FormData) => FormState | Promise<FormState>;
  defaultData?: TBookmark;
  hideBtnIcon?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const initialState: FormState = { success: false, submissionId: 0 };
const initialFormValues = (defaultData?: TBookmark) => ({
  title: defaultData?.title ?? "",
  description: defaultData?.description ?? "",
  url: defaultData?.url ?? "",
  tags: defaultData?.tags ?? [],
});

export const BookmarkModal = ({
  actionFn,
  defaultData,
  hideBtnIcon = false,
  open,
  onOpenChange,
}: BookmarkModalProps) => {
  const [state, action, isPending] = useActionState(
    async (prevState: FormState, data: FormData) => {
      const r = await actionFn(data);
      if (r.success) queueMicrotask(() => refresh?.());
      return { ...r, submissionId: (prevState.submissionId || 0) + 1 };
    },
    initialState,
  );

  const { data } = useSession();
  const { refresh } = useDashboard();
  const formRef = useRef<HTMLFormElement>(null);
  const handledSuccessRef = useRef<number>(0); // track last handled submissionId
  const [internalOpen, setInternalOpen] = useState(false);
  const [showAiForm, setShowAiForm] = useState(false);
  const [formState, setFormState] = useState(() => ({
    values: initialFormValues(defaultData),
    errors: null as FieldErrorState | null,
  }));
  const [aiData, setAiData] = useState<GeneratedAIData | null>(null);

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const actualOpen = isControlled ? open : internalOpen;
  const isEdit = !!defaultData;
  const isDemo = data?.user?.role === "demo";

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      values: {
        title: aiData?.title ?? state.data?.title ?? defaultData?.title ?? "",
        description:
          aiData?.description ?? state.data?.description ?? defaultData?.description ?? "",
        url: aiData?.url ?? state.data?.url ?? defaultData?.url ?? "",
        tags: aiData?.tags ?? state.data?.tags ?? defaultData?.tags ?? [],
      },
    }));
  }, [aiData, defaultData, state.data]);

  useEffect(() => {
    if (!state.success) return;
    if (handledSuccessRef.current === state.submissionId) return;
    handledSuccessRef.current = state.submissionId || 0;

    setAiData(null);
    setShowAiForm(false);
    setFormState({
      values: initialFormValues(defaultData),
      errors: null,
    });

    if (isControlled) onOpenChange?.(false);
    else setInternalOpen(false);

    toastAction({
      label: defaultData ? "Changes saved." : "Bookmark added successfully.",
      icon: "check",
    });
  }, [state.success, state.submissionId, defaultData, isControlled, onOpenChange]);

  useEffect(() => {
    setFormState((prev) => ({ ...prev, errors: state.error ?? null }));
  }, [state.error]);

  // Show a toast for top-level errors (non-field)
  useEffect(() => {
    const message = state.error?.message;
    if (!message) return;
    toastAction(message);
  }, [state]);

  const errorMessage = (path: FieldNames) => formState.errors?.[path];
  const clearError = (path: FieldNames) =>
    setFormState((prev) => ({
      ...prev,
      errors: prev.errors ? { ...prev.errors, [path]: undefined } : prev.errors,
    }));

  // Reset when dialog closes manually
  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        formRef.current?.reset();
        setAiData(null);
        setShowAiForm(false);
        setFormState({
          values: initialFormValues(defaultData),
          errors: null,
        });
      }
      if (isControlled) onOpenChange?.(next);
      else setInternalOpen(next);
    },
    [onOpenChange, isControlled, defaultData],
  );

  const handleAiFormClose = useCallback(() => setShowAiForm(false), []);

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
            {showAiForm ? "Generate with AI" : isEdit ? "Edit Bookmark" : "Add Bookmark"}
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between gap-2">
            <span>
              {showAiForm
                ? "Enter a URL to generate your bookmark's metadata using AI."
                : isEdit
                  ? "Update your saved link details — change the title, description, URL, or tags anytime."
                  : "Save a link with details to keep your collection organized."}
            </span>
            {!isEdit && !showAiForm && (
              <Button variant="link" size="auto" onClick={() => setShowAiForm(true)}>
                Try with AI 🤖
              </Button>
            )}
          </DialogDescription>
        </DialogHeader>
        {showAiForm ? (
          <GenerateMetadataForm
            closeAiForm={handleAiFormClose}
            onSuccess={(data) => {
              setAiData(data);
              setShowAiForm(false);
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
              <FieldGroup className="gap-5">
                <TitleInput
                  value={formState.values.title}
                  onChange={(v) =>
                    setFormState((s) => ({ ...s, values: { ...s.values, title: v } }))
                  }
                  error={!!errorMessage("title")}
                  errorMessage={errorMessage("title") || ""}
                  onClearError={() => clearError("title")}
                />
                <DescriptionTextarea
                  value={formState.values.description}
                  onChange={(v) =>
                    setFormState((s) => ({ ...s, values: { ...s.values, description: v } }))
                  }
                  error={!!errorMessage("description")}
                  errorMessage={errorMessage("description") || ""}
                  onClearError={() => clearError("description")}
                />
                <UrlInput
                  value={formState.values.url}
                  onChange={(v) => setFormState((s) => ({ ...s, values: { ...s.values, url: v } }))}
                  favicon={aiData?.favicon || defaultData?.favicon}
                  error={!!errorMessage("url")}
                  errorMessage={errorMessage("url") || ""}
                  onClearError={() => clearError("url")}
                />
                <TagsInput
                  value={formState.values.tags}
                  onChange={(v) =>
                    setFormState((s) => ({ ...s, values: { ...s.values, tags: v } }))
                  }
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
              <ActionButton type="submit" isPending={isPending} disabled={isDemo || isPending}>
                {isEdit ? "Edit Bookmark" : "Add Bookmark"}
                {isDemo && <UserLockIcon className="p-1" />}
              </ActionButton>
            </div>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
