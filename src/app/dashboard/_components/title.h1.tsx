export const DashboardTitle = ({
  headerTitle,
  query,
  tags,
}: {
  headerTitle: string;
  query: string | null;
  tags: string | null;
}) => {
  let title = <h1 className="text-foreground truncate text-xl font-bold">{headerTitle}</h1>;
  if (query && tags) {
    title = (
      <h1 className="text-foreground truncate text-lg font-bold sm:text-xl">
        Bookmarks tagged:{" "}
        <span title={tags} className="text-primary dark:text-muted-foreground truncate">
          {tags}
        </span>
        <br />
        Filtered by:{" "}
        <span className="text-primary dark:text-muted-foreground truncate">“{query}”</span>
      </h1>
    );
  } else if (query) {
    title = (
      <h1 className="text-foreground text-xl font-bold">
        Results for:{" "}
        <span className="text-primary dark:text-muted-foreground truncate">“{query}”</span>
      </h1>
    );
  } else if (tags) {
    title = (
      <h1 className="text-foreground truncate text-lg font-bold sm:text-xl">
        Bookmarks tagged:{" "}
        <span title={tags} className="text-primary dark:text-muted-foreground truncate">
          {tags}
        </span>
      </h1>
    );
  }

  return title;
};
