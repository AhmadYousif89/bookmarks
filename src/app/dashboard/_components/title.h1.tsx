import { cn } from "@/lib/utils";

type DashboardTitleProps = {
  headerTitle: string;
  query: string | null;
  tags: string | null;
};

export const DashboardTitle = ({ headerTitle, query, tags }: DashboardTitleProps) => {
  const baseStyles = "grid text-xl font-bold text-foreground gap-1";

  let title = <h1 className={baseStyles}>{headerTitle}</h1>;

  if (query && tags) {
    title = (
      <h1 className={cn(baseStyles, "text-lg sm:text-xl")}>
        <div title={tags} className="flex flex-wrap gap-1 truncate">
          <span>Bookmarks tagged:</span>
          <span className="text-primary dark:text-muted-foreground truncate">{tags}</span>
        </div>
        <div title={query} className="flex flex-wrap gap-1 truncate">
          <span>Filtered by:</span>
          <span className="text-primary dark:text-muted-foreground truncate">"{query}"</span>
        </div>
      </h1>
    );
  } else if (query) {
    title = (
      <h1 className={cn(baseStyles, "grid-flow-col")}>
        <span>Results for:</span>
        <span className="text-primary dark:text-muted-foreground truncate">"{query}"</span>
      </h1>
    );
  } else if (tags) {
    title = (
      <h1 className={cn(baseStyles, "text-lg sm:text-xl")}>
        <span>Bookmarks tagged:</span>
        <span className="text-primary dark:text-muted-foreground truncate">{tags}</span>
      </h1>
    );
  }

  return title;
};
