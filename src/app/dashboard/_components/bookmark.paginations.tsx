"use client";

import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUrlState } from "@/app/hooks/use-url-state";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
};

export const BookmarkPaginations: React.FC<Props> = ({ page, totalPages }) => {
  const { updateURL } = useUrlState();
  if (!totalPages || totalPages <= 1 || page > totalPages) return null;

  const onNavigate = (targetPage: number) => {
    updateURL({ page: targetPage.toString() });
  };

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  return (
    <Pagination className="mt-auto justify-between">
      <Button
        variant="ghost"
        title="Previous Page"
        disabled={isPrevDisabled}
        aria-disabled={isPrevDisabled}
        onClick={() => onNavigate(Math.max(1, page - 1))}
        className={cn(
          "dark:bg-accent hover:text-foreground size-10 bg-white p-0 text-sm",
          isPrevDisabled && "pointer-events-none opacity-50",
        )}
      >
        <ChevronLeft className="size-5" />
        <span className="sr-only">Previous Page</span>
      </Button>

      <PaginationContent className="gap-2">
        {start > 1 && (
          <>
            <PaginationItem>
              <Button
                variant="ghost"
                disabled={page === 1}
                aria-disabled={page === 1}
                onClick={() => onNavigate(1)}
                className="dark:bg-accent hover:text-foreground size-10 bg-white p-0 text-sm"
                aria-current={page === 1 ? "page" : undefined}
              >
                1
              </Button>
            </PaginationItem>
            {start > 2 && <PaginationEllipsis />}
          </>
        )}

        {pages.map((p) => (
          <PaginationItem key={p}>
            <Button
              variant="ghost"
              disabled={p === page}
              onClick={() => onNavigate(p)}
              className={cn(
                "dark:bg-accent hover:text-foreground size-10 bg-white p-0 text-sm",
                p === page &&
                  "bg-primary text-primary-foreground dark:bg-primary-foreground dark:text-primary",
              )}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Button>
          </PaginationItem>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <PaginationEllipsis />}
            <PaginationItem>
              <Button
                variant="ghost"
                disabled={page === totalPages}
                onClick={() => onNavigate(totalPages)}
                className="dark:bg-accent hover:text-foreground size-10 bg-white p-0 text-sm"
                aria-current={page === totalPages ? "page" : undefined}
              >
                {totalPages}
              </Button>
            </PaginationItem>
          </>
        )}
      </PaginationContent>

      <Button
        variant="ghost"
        title="Next Page"
        disabled={isNextDisabled}
        aria-disabled={isNextDisabled}
        onClick={() => onNavigate(Math.min(totalPages, page + 1))}
        className="dark:bg-accent hover:text-foreground size-10 bg-white p-0 text-sm"
      >
        <ChevronRight className="size-5" />
        <span className="sr-only">Next Page</span>
      </Button>
    </Pagination>
  );
};
