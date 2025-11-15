"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "../../dashboard.context";

const LINKS = [
  { name: "Active", href: "/dashboard", icon: "home" },
  { name: "Archived", href: "/dashboard/archived", icon: "archive" },
] as const;

export const SideSheetLinks = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { active, archived, loading } = useDashboard();

  const match = (path: string) => pathname === path;
  // Preserve filters (query, tags, sort) but reset pagination when switching pages
  const hrefWithFilters = (path: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("page");
    params.delete("limit");
    const qs = params.toString();
    return qs ? `${path}?${qs}` : path;
  };

  return (
    <ul>
      {LINKS.map((link) => {
        const count = link.name === "Active" ? active : archived;
        return (
          <li key={link.name} className="py-0.5">
            <Button
              asChild
              variant="navLink"
              className={cn(
                "justify-between pr-3",
                match(link.href) && "bg-accent text-foreground",
              )}
            >
              <Link href={hrefWithFilters(link.href)} className="group">
                <span className="flex items-center gap-2">
                  <Icon
                    name="home"
                    className={cn(
                      "dark:group-focus-visible:*:stroke-foreground group-focus-visible:*:stroke-foreground",
                      match(link.href) ? "*:stroke-foreground" : "*:stroke-muted-foreground",
                    )}
                  />
                  {link.name}
                </span>
                {loading && count && count > 0 ? (
                  <Skeleton className="aspect-square size-5.5 rounded-full" />
                ) : count ? (
                  <Badge
                    aria-disabled={!match(link.href)}
                    className={cn(
                      "aspect-square size-5.5",
                      match(link.href)
                        ? "dark:bg-muted"
                        : "dark:group-hover:bg-muted dark:bg-input duration-0",
                    )}
                  >
                    {count}
                  </Badge>
                ) : null}
              </Link>
            </Button>
          </li>
        );
      })}
    </ul>
  );
};
