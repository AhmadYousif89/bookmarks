import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "./lib/auth";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4">{children}</main>
  );
}
