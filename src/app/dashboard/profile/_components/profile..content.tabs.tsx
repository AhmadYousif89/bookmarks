import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/app/(auth)/lib/auth";
import { User, ShieldUser, KeyRound, Trash2 } from "lucide-react";

import { ProfileHeader } from "./header";
import { ProfileTab } from "./profile.tab";
import { AccountTab } from "./account.tab";
import { SecurityTab } from "./security.tab";
import { SessionsTab } from "./sessions.tsb";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ProfileContentTabs = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return null;

  const { user, session: userSession } = session;
  const token = userSession?.token || "";

  return (
    <>
      <Suspense fallback={<Skeleton className="h-18 md:h-23" />}>
        <ProfileHeader user={user} />
      </Suspense>

      <Tabs aria-label="Profile settings tabs" defaultValue="profile" className="gap-0">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="size-5" />
            <span className="max-sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldUser className="size-5" />
            <span className="max-sm:hidden">Security</span>
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <KeyRound />
            <span className="max-sm:hidden">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="danger">
            <Trash2 />
            <span className="max-sm:hidden">Danger</span>
          </TabsTrigger>
        </TabsList>

        <div className="py-6">
          <TabsContent value="profile">
            <Suspense>
              <ProfileTab user={user} />
            </Suspense>
          </TabsContent>
          <TabsContent value="security" className="flex flex-col gap-8">
            <Suspense>
              <SecurityTab isDemo={!!user.isDemo} />
            </Suspense>
          </TabsContent>
          <TabsContent value="sessions">
            <Suspense>
              <SessionsTab
                sessions={await getSessions()}
                currentSessionToken={token}
                isDemo={!!user.isDemo}
              />
            </Suspense>
          </TabsContent>
          <TabsContent value="danger">
            <Suspense>
              <AccountTab isDemo={!!user.isDemo} />
            </Suspense>
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
};

async function getSessions() {
  const sessions = await auth.api.listSessions({ headers: await headers() });
  return sessions || [];
}
