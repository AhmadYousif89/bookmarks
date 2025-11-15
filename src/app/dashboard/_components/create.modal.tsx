import { BookmarkModal } from "./bookmark.dialog";
import { createBookmarkAction } from "../actions/create";

export const AddBookmarkModal = async ({ hideBtnIcon = false }: { hideBtnIcon?: boolean }) => {
  return <BookmarkModal hideBtnIcon={hideBtnIcon} actionFn={createBookmarkAction} />;
};
