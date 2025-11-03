export type FieldNames = "name" | "email" | "password" | "confirmPassword" | "newPassword";
export type FieldLabels =
  | "Full name"
  | "Email"
  | "Email address"
  | "Password"
  | "Confirm password"
  | "New password";

export type FieldErrors = Record<FieldNames, string>;

export type FormState = {
  success: boolean;
  error?: FieldErrors | string | { [x: string]: string };
  message?: string;
};

export type FormDataRecord = Record<FieldNames, string>;

export type FieldProps =
  | {
      label: FieldLabels;
      type: "text" | "email" | "password";
      name: FieldNames;
      hint: string;
    }
  | ({
      label: FieldLabels;
      type: "text" | "email" | "password";
      name: FieldNames;
    } & { hint?: never });
