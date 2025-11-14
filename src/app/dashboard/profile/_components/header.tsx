"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Session } from "@/app/(auth)/lib/auth.client";
import { ActionButton } from "@/components/action.button";
import { UserAvatar } from "../../_components/header/user.avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toastAction } from "../../_components/toast-action";
import { uploadUserAvatar } from "../actions";
import { Upload, UploadCloud } from "lucide-react";

export const ProfileHeader = ({ user }: { user: Session["user"] }) => {
  const router = useRouter();
  const [state, action, isPending] = useActionState(
    (pv: unknown, data: FormData) => uploadUserAvatar(data),
    { success: false, message: "" },
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isdemo = user.isDemo || false;
  const uploadedImageUrl = state.success ? state.imageUrl : null;

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toastAction({ label: state.message, icon: "check" });
        setImageFile(null);
        router.refresh();
      } else toastAction(state.message);
    }
  }, [state]);

  return (
    <Card className="flex-row items-stretch justify-between gap-4 border-none p-4 shadow-none md:p-6">
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

          <div className="grid justify-items-end self-start">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="dark:bg-muted cursor-default text-center whitespace-normal">
                  {user.role}
                </Badge>
              </TooltipTrigger>
              <TooltipContent showArrow align="end">
                {isdemo ? "Demo account with limited access." : "Basic account"}
              </TooltipContent>
            </Tooltip>
          </div>
        </>
      ) : (
        <Form action={action} className="flex w-full items-stretch justify-between gap-4">
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="dark:bg-muted cursor-default text-center whitespace-normal">
                  {user.role}
                </Badge>
              </TooltipTrigger>
              <TooltipContent showArrow align="end">
                {isdemo ? "Demo account with limited access." : "Basic account"}
              </TooltipContent>
            </Tooltip>

            {imageFile && imageFile.size > 0 && (
              <ActionButton
                type="submit"
                size="auto"
                variant="secondary"
                disabled={isPending}
                isPending={isPending}
                className="mt-2 min-w-10.5 rounded-full py-0.5 sm:px-2 sm:py-1 *:[svg]:size-4.5"
              >
                <Upload />
                <span className="max-sm:sr-only sm:hidden">
                  {isPending ? "Uploading..." : "Upload avatar"}
                </span>
                <span className="hidden text-xs sm:block">Upload avatar</span>
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
  onFileSelected?: (file: File) => void;
  className?: string;
  inputName?: string;
};

export const UserImagePicker = ({ name, image, inputName, onFileSelected, className }: Props) => {
  const [preview, setPreview] = useState<string | null>(image ?? null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

  useEffect(() => {
    setPreview(image ?? null);
  }, [image]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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

  const initials =
    name && name.length
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";

  return (
    <div className="bg-primary dark:bg-accent flex size-10 items-center justify-center rounded-full">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="auto"
            variant="ghost"
            onClick={handleClick}
            aria-label="Select profile image"
            className="bg-background size-fit cursor-pointer overflow-hidden rounded-full p-0"
          >
            <Avatar className="bg-background size-10">
              {preview ? (
                <AvatarImage
                  src={preview}
                  alt={`${name} avatar`}
                  className="aspect-square rounded-full bg-transparent object-cover object-center"
                />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
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
