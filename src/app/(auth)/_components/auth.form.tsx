import Form from "next/form";
import {
  use,
  useRef,
  useState,
  createContext,
  useActionState,
  type ReactNode,
  useEffect,
  useMemo,
} from "react";
import { Eye, EyeClosed } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ActionButton } from "@/components/action.button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { FieldErrors, FieldNames, FieldProps, FormDataRecord, FormState } from "../lib/types";
import { toastAction } from "@/app/dashboard/_components/toast-action";
import { authClient } from "../lib/auth.client";
import { Button } from "@/components/ui/button";

type TAuthFormContext = {
  isPending: boolean;
  state: FormState;
  formDataRef: React.RefObject<Record<FieldNames, string>>;
};

const AuthFormContext = createContext<TAuthFormContext | null>(null);

const useAuthForm = () => {
  const ctx = use(AuthFormContext);
  if (!ctx) {
    throw new Error("AuthForm compound components must be used within AuthForm");
  }
  return ctx;
};

type AuthFormProps = {
  children: ReactNode;
  action: (data: FormData) => FormState | Promise<FormState>;
  onSuccess?: () => void;
};

const initialFormData: FormDataRecord = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  newPassword: "",
};

function AuthForm({ children, action, onSuccess }: AuthFormProps) {
  const shownMessageRef = useRef<string | null>(null);
  const formDataRef = useRef<Record<FieldNames, string>>(initialFormData);
  const [state, actionFn, isPending] = useActionState(
    (state: FormState, data: FormData) => {
      formDataRef.current = Object.fromEntries(data.entries()) as FormDataRecord;
      return action(data);
    },
    { success: false },
  );
  const ctxValue = useMemo(() => ({ state, isPending, formDataRef }), [state, isPending]);

  // Clear shown message when new submission starts
  useEffect(() => {
    if (isPending) shownMessageRef.current = null;
  }, [isPending]);
  // Render Toast for non-field errors/messages
  useEffect(() => {
    if (state.error && typeof state.error === "string") {
      if (shownMessageRef.current !== state.error) {
        toastAction(state.error);
        shownMessageRef.current = state.error;
      }
    }
    if (state.message) {
      if (shownMessageRef.current !== state.message) {
        toastAction({ label: state.message, icon: "check" });
        shownMessageRef.current = state.message;
      }
    }
    if (state.success && onSuccess) onSuccess();
  }, [state, onSuccess]);

  return (
    <AuthFormContext.Provider value={ctxValue}>
      <Form action={actionFn} className="flex flex-col gap-4" noValidate>
        {children}
      </Form>
    </AuthFormContext.Provider>
  );
}

type AuthFieldProps = FieldProps & React.ComponentProps<"input">;

function AuthField({ label, type, onChange, ...props }: AuthFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { state, isPending, formDataRef } = useAuthForm();
  const [togglePass, setTogglePass] = useState<"show" | "hide">("hide");
  const [clearedErrors, setClearedErrors] = useState<Set<FieldNames>>(new Set());

  const isPasswordField = type === "password" && props.name === "password";

  const fieldErrors =
    state.error && typeof state.error === "object" && !Array.isArray(state.error)
      ? (state.error as FieldErrors)
      : undefined;

  const name = props.name as FieldNames;
  const isCleared = name ? clearedErrors.has(name) : false;
  const fieldError = !isCleared ? fieldErrors?.[name] : undefined;
  const hasError = Boolean(fieldError);
  const fieldDefaultValue = formDataRef.current?.[name] || "";

  useEffect(() => {
    if (props.autoFocus) {
      const id = requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [props.autoFocus]);

  // Reset cleared flags when server-side error state changes
  useEffect(() => {
    setClearedErrors(new Set());
  }, [state.error]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange?.(e);
    if (fieldErrors?.[name]) {
      setClearedErrors((prev) => {
        const next = new Set(prev);
        next.add(name);
        return next;
      });
    }
  };

  return (
    <FieldSet disabled={isPending}>
      <Field className="gap-1.5 *:[label]:w-fit">
        <FieldLabel htmlFor={props.name} className="text-foreground gap-0.5 text-sm font-semibold">
          {label}
          {props.hint && (
            <span className="dark:text-muted-foreground text-teal-700">{props.hint}</span>
          )}
        </FieldLabel>
        <InputGroup>
          <div className="flex w-full items-center justify-between">
            <InputGroupInput
              required
              ref={inputRef}
              id={props.name}
              disabled={isPending}
              onChange={handleChange}
              auto-focus={props.autoFocus}
              aria-invalid={hasError || undefined}
              auto-complete={
                name === "email" ? "email" : isPasswordField ? "current-password" : "off"
              }
              aria-describedby={hasError ? `${props.name}-error` : undefined}
              defaultValue={fieldDefaultValue}
              type={isPasswordField ? (togglePass === "hide" ? "password" : "text") : type}
              {...props}
            />
            {isPasswordField && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  className="h-8 rounded"
                  title={togglePass === "hide" ? "Show password" : "Hide password"}
                  onClick={() => setTogglePass(togglePass === "hide" ? "show" : "hide")}
                  aria-label={togglePass === "hide" ? "Show password" : "Hide password"}
                  aria-pressed={togglePass === "hide" ? "false" : "true"}
                >
                  {togglePass === "hide" ? <Eye /> : <EyeClosed />}
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </div>
          {hasError && (
            <InputGroupAddon align="block-end" className="border-t">
              <FieldError
                id={`${props.name}-error`}
                className="text-sm/normal font-medium tracking-tight"
              >
                {fieldError}
              </FieldError>
            </InputGroupAddon>
          )}
        </InputGroup>
      </Field>
    </FieldSet>
  );
}

function SubmitButton({ children, isSubmitting }: { children: ReactNode; isSubmitting?: boolean }) {
  const { isPending } = useAuthForm();

  return (
    <ActionButton
      type="submit"
      className="w-full"
      disabled={isPending}
      isPending={isPending || isSubmitting}
    >
      {children}
    </ActionButton>
  );
}

function SendVerificationButton() {
  const { state, formDataRef } = useAuthForm();
  const [isPending, setIsPending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (state.verified !== false) return null;

  const email = formDataRef.current?.email || "";

  return (
    <>
      <div className="flex items-center justify-center gap-1.5">
        <input type="hidden" name="email" value={email} />
        <span className="text-muted-foreground text-sm/normal font-medium">
          Send verification link?
        </span>
        <Button
          size="auto"
          type="button"
          variant="link"
          onClick={async () => {
            setIsPending(true);
            await authClient.sendVerificationEmail({ email, callbackURL: "/dashboard" });
            toastAction({
              label: "Verification email sent. Please check your inbox.",
              icon: "check",
            });
            setIsPending(false);
            setIsSent(true);
          }}
          disabled={isPending || isSent}
        >
          {isPending ? "Sending..." : isSent ? "Sent" : "Resend"}
        </Button>
      </div>
    </>
  );
}

AuthForm.Field = AuthField;
AuthForm.SubmitButton = SubmitButton;
AuthForm.SendVerificationButton = SendVerificationButton;

export { AuthForm };
