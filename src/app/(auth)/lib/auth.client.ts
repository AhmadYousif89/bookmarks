import { auth } from './auth';
import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
  fetchOptions: { credentials: 'include' },
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const useSession = () => authClient.useSession();
export type ClientSession = ReturnType<typeof useSession>;
export const getSession = async () => await authClient.getSession();
export const signOut = () =>
  authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = '/'; // Redirect to home on sign out
      },
    },
  });
