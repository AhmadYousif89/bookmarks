import { SearchForm } from "./header/search.form";
import { UserAvatarMenu } from "./header/user.menu";
import { AddBookmarkModal } from "./create.modal";
import { auth } from "@/app/(auth)/lib/auth";
import { headers } from "next/headers";

export const DashboardHeader = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user) return null;

  return (
    <header className="bg-card px-4 py-3 md:px-8 md:py-4">
      <nav className="flex items-center justify-between gap-3">
        <SearchForm />
        <div className="flex items-center gap-2.5 md:gap-4">
          <AddBookmarkModal />
          <UserAvatarMenu user={user} />
        </div>
      </nav>
    </header>
  );
};
