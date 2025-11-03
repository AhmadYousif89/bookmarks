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
export const getSession = await authClient.getSession();
export const getSessions = async () =>
  await authClient.listSessions({ fetchOptions: { credentials: "include" } });
export const signOut = () =>
  authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = "/";
      },
    },
  });
