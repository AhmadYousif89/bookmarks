import { headers } from "next/headers";

import { auth } from "@/app/(auth)/lib/auth";
import { createBookmarkAction } from "../actions/create";
import { BookmarkModal } from "./bookmark.dialog";
import { Badge } from "@/components/ui/badge";

export const AddBookmarkModal = async ({ hideBtnIcon = false }: { hideBtnIcon?: boolean }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  const isDemo = session?.user?.isDemo ?? false;

  if (isDemo)
    return (
      <Badge className="dark:bg-muted min-w-10">
        Demo <span className="max-sm:hidden">Mode</span>
      </Badge>
    );

  return <BookmarkModal hideBtnIcon={hideBtnIcon} actionFn={createBookmarkAction} />;
};
