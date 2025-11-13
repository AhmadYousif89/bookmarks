import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "../(auth)/lib/auth";
import { DashboardHeader } from "./_components/header";
import { SessionGuard } from "./session-guard";
import { DashboardProvider } from "./dashboard.context";
import { SideSheet } from "./_components/sidebar/side.sheet";

export const metadata: Metadata = {
  title: "Dashboard - Bookmark Manager",
  description: "Save and manage your bookmarks with Bookmark Manager.",
};

export default async function DashboardLayout({ children, profile }: LayoutProps<"/dashboard">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <SessionGuard>
      <DashboardProvider>
        {profile} {/*  Interceptor Profile Modal */}
        <div className="max-w-site mx-auto flex min-h-dvh w-full flex-col">
          <div className="flex grow">
            <SideSheet />
            <div className="flex grow flex-col">
              <DashboardHeader />
              {children}
            </div>
          </div>
        </div>
      </DashboardProvider>
    </SessionGuard>
  );
}
