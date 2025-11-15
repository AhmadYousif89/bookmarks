import Image from "next/image";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Icon } from "@/components/ui/icon";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

type UrlInputProps = {
  url?: string;
  favicon?: string;
  error: boolean;
  errorMessage: string;
  onClearError?: () => void;
};

export const UrlInput = ({ url, favicon, error, errorMessage, onClearError }: UrlInputProps) => {
  return (
    <Field className="gap-1.5 *:[label]:w-fit">
      <FieldLabel htmlFor="url" className="text-foreground gap-0.5 text-sm font-semibold">
        Website URL <span className="text-primary dark:text-muted-foreground">*</span>
      </FieldLabel>
      <InputGroup>
        {favicon && (
          <InputGroupAddon align={"inline-end"} className="bg-background dark:bg-input-500 p-2">
            <Image
              src={favicon}
              alt="Favicon"
              width={10}
              height={10}
              className="size-8 rounded-sm"
              unoptimized
            />
          </InputGroupAddon>
        )}
        <InputGroupInput
          required
          id="url"
          name="url"
          autoComplete="off"
          defaultValue={url || ""}
          placeholder="https://"
          onChange={onClearError}
          onFocus={onClearError}
          aria-invalid={error || undefined}
          aria-describedby={error ? "url-error" : undefined}
        />
        {error && (
          <InputGroupAddon align="block-end" className="border-t">
            <InputGroupButton
              type="button"
              variant="destructive"
              className="size-4 py-2"
              onClick={onClearError}
              aria-label="Dismiss URL error"
            >
              <Icon name="close" className="*:stroke-primary-foreground scale-75" />
            </InputGroupButton>
            <FieldError id="url-error" className="text-sm/normal font-medium tracking-tight">
              {errorMessage}
            </FieldError>
          </InputGroupAddon>
        )}
      </InputGroup>
    </Field>
  );
};
