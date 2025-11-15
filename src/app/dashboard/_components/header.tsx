import { headers } from "next/headers";
import { auth } from "@/app/(auth)/lib/auth";

import { SearchForm } from "./header/search.form";
import { AddBookmarkModal } from "./create.modal";
import { UserAvatarMenu } from "./header/user.menu";
import { UserBadge } from "@/components/user.badge";

export const DashboardHeader = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user) return null;

  const isDemo = !!session?.user?.isDemo;

  return (
    <header className="bg-card px-4 py-3 md:px-8 md:py-4">
      <nav className="flex items-center justify-between gap-3">
        <SearchForm />
        <div className="flex items-center gap-2.5 md:gap-4">
          {isDemo ? (
            <UserBadge isDemo={isDemo}>
              Demo <span className="hidden sm:inline-block">Mode</span>
            </UserBadge>
          ) : (
            <AddBookmarkModal />
          )}
          <UserAvatarMenu user={user} />
        </div>
      </nav>
    </header>
  );
};
