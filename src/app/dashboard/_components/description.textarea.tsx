import { useState, useRef } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Icon } from "@/components/ui/icon";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { getColor } from "../_lib/util";

const MAX_DESCRIPTION_LENGTH = 280;

type DescriptionTextareaProps = {
  error: boolean;
  description?: string;
  errorMessage: string;
  onClearError?: () => void;
};

export const DescriptionTextarea = ({
  error,
  description,
  errorMessage,
  onClearError,
}: DescriptionTextareaProps) => {
  const truncatedDescription = description?.slice(0, MAX_DESCRIPTION_LENGTH) || ""; // Ensure initial value is within limit
  const [charCount, setCharCount] = useState(truncatedDescription.length);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value.trim();
    if (value.length > MAX_DESCRIPTION_LENGTH) {
      value = value.slice(0, MAX_DESCRIPTION_LENGTH); // Truncate to max length
      e.target.value = value;
    }
    setCharCount(value.length);
  };

  return (
    <Field className="gap-1.5 *:[label]:w-fit">
      <FieldLabel htmlFor="description" className="text-foreground gap-0.5 text-sm font-semibold">
        Description <span className="text-primary dark:text-muted-foreground">*</span>
      </FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          required
          id="description"
          name="description"
          onChange={handleChange}
          defaultValue={truncatedDescription}
          onFocus={onClearError}
          aria-invalid={error || undefined}
          aria-describedby={error ? "description-error" : undefined}
        />
        <svg
          className="**:stroke-muted absolute right-2 bottom-2 size-fit cursor-default stroke-2"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 2L2 10" stroke="#DDE9E7" strokeLinecap="round" />
          <path d="M11 7L7 11" stroke="#DDE9E7" strokeLinecap="round" />
        </svg>
        {error && (
          <InputGroupAddon align="block-end" className="border-t">
            <InputGroupButton
              type="button"
              variant="destructive"
              className="size-4 py-2"
              onClick={onClearError}
              aria-label="Dismiss description error"
            >
              <Icon name="close" className="*:stroke-primary-foreground scale-75" />
            </InputGroupButton>
            <FieldError
              id="description-error"
              className="text-sm/normal font-medium tracking-tight"
            >
              {errorMessage}
            </FieldError>
          </InputGroupAddon>
        )}
      </InputGroup>

      <FieldDescription className="grid justify-end text-xs" style={{ color: getColor(charCount) }}>
        {charCount}/280
      </FieldDescription>
    </Field>
  );
};
