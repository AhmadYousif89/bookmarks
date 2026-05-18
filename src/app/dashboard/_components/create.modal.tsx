import { createBookmarkAction } from "../actions/create";
import { BookmarkModal } from "../bookmark/bookmark.dialog";

export const AddBookmarkModal = async ({ hideBtnIcon = false }: { hideBtnIcon?: boolean }) => {
  return <BookmarkModal hideBtnIcon={hideBtnIcon} actionFn={createBookmarkAction} />;
};
