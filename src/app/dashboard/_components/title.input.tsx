import { Icon } from "@/components/ui/icon";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type TitleInputProps = {
  value: string;
  onChange: (title: string) => void;
  error: boolean;
  errorMessage: string;
  onClearError?: () => void;
};

export const TitleInput = ({
  value,
  error,
  errorMessage,
  onClearError,
  onChange,
}: TitleInputProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    onClearError?.();
  };

  return (
    <Field className="gap-1.5 *:[label]:w-fit">
      <FieldLabel htmlFor="title" className="text-foreground gap-0.5 text-sm font-semibold">
        Title <span className="text-primary dark:text-muted-foreground">*</span>
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          required
          id="title"
          name="title"
          autoComplete="off"
          value={value}
          onChange={handleOnChange}
          onFocus={onClearError}
          aria-invalid={error || undefined}
          aria-describedby={error ? "title-error" : undefined}
        />
        {error && (
          <InputGroupAddon align="block-end" className="border-t">
            <InputGroupButton
              type="button"
              variant="destructive"
              className="size-4 py-2"
              onClick={onClearError}
              aria-label="Dismiss title error"
            >
              <Icon name="close" className="*:stroke-primary-foreground scale-75" />
            </InputGroupButton>
            <FieldError id="title-error" className="text-sm/normal font-medium tracking-tight">
              {errorMessage}
            </FieldError>
          </InputGroupAddon>
        )}
      </InputGroup>
    </Field>
  );
};
