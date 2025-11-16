"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";

import { Session } from "@/app/(auth)/lib/auth.client";
import { uploadUserAvatar } from "../actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserBadge } from "@/components/user.badge";
import { UserAvatar } from "@/components/user.avatar";
import { toastAction } from "@/components/toast-action";
import { ActionButton } from "@/components/action.button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const ProfileHeader = ({ user }: { user: Session["user"] }) => {
  const router = useRouter();
  const [state, action, isPending] = useActionState(
    (pv: unknown, data: FormData) => uploadUserAvatar(data),
    { success: false, message: "" },
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const lastImageRef = useRef<string | null>(null);

  const isdemo = user.isDemo || false;
  const uploadedImageUrl = state.success ? state.imageUrl : null;

  useEffect(() => {
    const { success, message, imageUrl } = state;
    if (!success) {
      if (message) toastAction(message);
      lastImageRef.current = null;
      return;
    }
    if (imageUrl && lastImageRef.current === imageUrl) return;
    if (message) toastAction({ label: message, icon: "check" });
    lastImageRef.current = imageUrl ?? null;
    setImageFile(null);
    router.refresh();
  }, [state]);

  return (
    <Card className="min-h-26 flex-row items-center justify-between gap-4 border-none p-4 shadow-none md:p-6">
      {isdemo ? (
        <>
          <div className="flex items-center gap-4">
            <div className="bg-primary dark:bg-accent flex size-10 items-center justify-center rounded-full">
              <UserAvatar name={user.name} image={user.image || ""} />
            </div>
            <div>
              <h2 className="text-lg font-bold">{user.name}</h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
          <div className="self-start">
            <UserBadge isDemo={isdemo}>{user.role}</UserBadge>
          </div>
        </>
      ) : (
        <Form action={action} className="flex min-h-14 w-full items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <UserImagePicker
              name={user.name}
              image={uploadedImageUrl || user.image || undefined}
              onFileSelected={(file) => setImageFile(file)}
              inputName="image"
            />
            <div>
              <h2 className="text-lg font-bold">{user.name}</h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid justify-items-end self-start">
            <UserBadge isDemo={isdemo}>{user.role}</UserBadge>

            {imageFile && imageFile.size > 0 && (
              <ActionButton
                type="submit"
                size="auto"
                variant="secondary"
                disabled={isPending}
                isPending={isPending}
                className="mt-1 min-w-10.5 rounded-full py-0.5 sm:px-2 sm:py-1 *:[svg]:size-4.5"
              >
                <span className="max-sm:sr-only sm:hidden">
                  {isPending ? "Uploading..." : "Upload avatar"}
                </span>
                <Upload />
                <span className="hidden text-xs/tight sm:block">Upload avatar</span>
              </ActionButton>
            )}
          </div>
        </Form>
      )}
    </Card>
  );
};

type Props = {
  name: string;
  image?: string | null;
  onFileSelected?: (file: File | null) => void;
  inputName?: string;
};

export const UserImagePicker = ({ name, image, inputName, onFileSelected }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const allowTooltipOpen = useRef(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(image ?? null);

  const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

  useEffect(() => {
    setPreview(image ?? null);
  }, [image]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handlePointerEnter = () => {
    allowTooltipOpen.current = true;
    setTooltipOpen(true);
  };

  const handlePointerLeave = () => {
    allowTooltipOpen.current = false;
    setTooltipOpen(false);
  };

  const handleTooltipOpenChange = (open: boolean) => {
    if (open) {
      if (allowTooltipOpen.current) setTooltipOpen(true);
      else setTooltipOpen(false);
    } else {
      allowTooltipOpen.current = false;
      setTooltipOpen(false);
    }
  };

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_BYTES) {
      toastAction("File is too large. Maximum size is 2 MB.");
      e.currentTarget.value = "";
      return;
    }
    const url = URL.createObjectURL(file);

    setPreview((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });

    onFileSelected?.(file);
  };

  const handleClearPreview = () => {
    setPreview((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return image || null;
    });
    onFileSelected?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="bg-primary dark:bg-accent relative flex size-10 items-center justify-center rounded-full">
      {preview && preview.startsWith("blob:") && (
        <Button
          type="button"
          size="auto"
          variant="destructive"
          title="Remove image"
          onClick={handleClearPreview}
          className="absolute -top-2.5 -left-2.5 z-20 w-fit rounded-full p-0.5"
        >
          <X className="size-3.5" />
          <span className="sr-only">Remove selected profile image</span>
        </Button>
      )}
      <Tooltip open={tooltipOpen} onOpenChange={handleTooltipOpenChange}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="auto"
            variant="ghost"
            onClick={handleClick}
            onBlur={handlePointerLeave}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            aria-label="Select profile image"
            className="size-fit cursor-pointer overflow-hidden rounded-full p-0"
          >
            <UserAvatar name={name} image={preview || undefined} />
          </Button>
        </TooltipTrigger>
        <TooltipContent showArrow align="center">
          Change profile image
        </TooltipContent>
      </Tooltip>

      <input
        ref={inputRef}
        name={inputName}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
