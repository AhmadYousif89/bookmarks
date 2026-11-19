import { auth } from "./auth";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  fetchOptions: { credentials: "include" },
  plugins: [inferAdditionalFields<typeof auth>()],
});

export type Session = typeof authClient.$Infer.Session;
export const useSession = () => authClient.useSession();
export const getSession = async () => await authClient.getSession();
export const getSessions = async () => await authClient.listSessions();
export const signOut = async () => {
  try {
    const { data, error } = await authClient.signOut();

    if (error) {
      console.error("Failed to sign out:", error);
      return;
    }

    if (data?.success) {
      window.location.assign("/");
    }
  } catch (error) {
    console.error("Failed to sign out:", error);
  }
};
