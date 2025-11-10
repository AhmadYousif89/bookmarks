import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "../(auth)/lib/auth";
import { DashboardHeader } from "./header";
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
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div
              className="absolute inset-0 bg-[linear-gradient(to_right,#4C5C5925_1px,transparent_1px),linear-gradient(to_bottom,#4C5C5925_1px,transparent_1px)] bg-size-[30px_30px]"
              style={{
                maskImage:
                  "radial-gradient(ellipse 60% 55% at 50% 55%, #000 50%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 60% 55% at 50% 55%, #000 50%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </DashboardProvider>
    </SessionGuard>
  );
}
