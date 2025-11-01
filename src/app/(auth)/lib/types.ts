import { ObjectId } from "mongodb";

export type FieldErrors = Record<string, string[]>;

export type FormState = { success: boolean; error: FieldErrors | null | string };

export type FieldProps =
  | {
      label: string;
      type: string;
      name: string;
      hint: string;
    }
  | ({
      label: string;
      type: string;
      name: string;
    } & { hint?: never });

export type DBColUser = {
  _id: string | ObjectId;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};
