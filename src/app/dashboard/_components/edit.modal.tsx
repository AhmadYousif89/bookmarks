import { TBookmark } from "@/lib/types";
import { BookmarkModal } from "./bookmark.dialog";
import { editBookmarkAction } from "../actions/update";

type Props = {
  bookmark: TBookmark;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const EditBookmarkModal = ({ bookmark, open, onOpenChange }: Props) => {
  return (
    <BookmarkModal
      open={open}
      onOpenChange={onOpenChange}
      actionFn={editBookmarkAction}
      defaultData={bookmark}
    />
  );
};
