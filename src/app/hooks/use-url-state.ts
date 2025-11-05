"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SortFormat, sortMap } from "../dashboard/_lib/config";

type URLParamMap = {
  query: string;
  sort: SortFormat;
  tags: string;
  page: string;
};

const SORT_VALUE_SET = new Set<string>(
  Object.values(sortMap).flatMap((v) => {
    const key = v.split(":")[0];
    return [`${key}:asc`, `${key}:desc`];
  }),
);

export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      const urlParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) urlParams.set(key, value);
        else urlParams.delete(key);
      });

      const current = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const next = `${pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""}`;

      if (next === current) return;
      router.push(next, { scroll: true });
    },
    [searchParams, pathname, router],
  );

  function getParam<K extends keyof URLParamMap>(key: K): URLParamMap[K] | undefined;
  function getParam<K extends keyof URLParamMap>(
    key: K,
    defaultValue: URLParamMap[K],
  ): URLParamMap[K];
  function getParam(key: string, defaultValue?: string) {
    const raw = searchParams.get(key);
    if (raw == null) return defaultValue;

    switch (key) {
      case "tags":
        return (raw || defaultValue) as string | undefined;
      case "sort":
        return (SORT_VALUE_SET.has(raw) ? raw : defaultValue) as SortFormat | undefined;
      case "query":
      case "page":
        return (raw || defaultValue) as string | undefined;
      default:
        return raw;
    }
  }

  return { updateURL, getParam };
}
