import { SortFormat } from "./config";

export type DashboardSearchParams = {
  query?: string;
  sort?: SortFormat;
  tags?: string[];
  page?: number;
  limit?: number;
};

export function parseSearchParams(sp: Record<string, string | string[] | undefined>) {
  const get = (k: string) => {
    const v = sp?.[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const query = get("q") ?? get("query") ?? undefined;
  const sort = get("sort") as SortFormat | undefined;
  const page = parseInt(get("page") ?? "", 10);
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const limit = parseInt(get("limit") ?? "", 10);
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 9;
  const tagsRaw = get("tags");
  const tags = tagsRaw ? tagsRaw.split(",").filter(Boolean) : undefined;

  return {
    ...{ query },
    ...{ sort },
    ...{ tags },
    page: safePage,
    limit: safeLimit,
  };
}
