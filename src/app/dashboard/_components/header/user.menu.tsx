"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Session, signOut } from "@/app/(auth)/lib/auth.client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user.avatar";
import { ThemeSwitcher } from "@/components/theme.switch";

export const UserAvatarMenu = ({ user }: { user: Session["user"] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hrefWithFilters = (path: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("page");
    params.delete("limit");
    const qs = params.toString();
    return qs ? `${path}?${qs}` : path;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:ring-ring ring-offset-background data-[state=open]:ring-ring rounded-full ring-offset-2 outline-none focus-visible:ring-2 data-[state=open]:ring-2">
          <UserAvatar name={user?.name ?? ""} image={user?.image ?? ""} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="border-border-100 dark:border-border min-w-62"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              asChild
              onSelect={() => {
                if (pathname !== "/dashboard/profile")
                  router.push(hrefWithFilters("/dashboard/profile"));
              }}
              className="px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <UserAvatar name={user.name} image={user.image || undefined} />
                <div className="grid">
                  <span className="text-foreground text-sm/normal font-semibold">{user.name}</span>
                  <span className="text-muted-foreground text-sm font-medium">{user.email}</span>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border-200 dark:bg-border" />
            <div className="px-2 py-1">
              <div className="flex w-full items-center justify-between p-2">
                <span className="text-muted-foreground flex items-center gap-2.5 text-sm font-semibold">
                  <span className="size-4">
                    <Icon name="theme" className="*:stroke-muted-foreground" />
                  </span>{" "}
                  Theme
                </span>
                <ThemeSwitcher />
              </div>
            </div>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-border-200 dark:bg-border" />
          <DropdownMenuItem className="group px-2 py-1">
            <Button
              variant="ghost"
              onClick={signOut}
              className="text-muted-foreground group-focus:text-foreground h-auto w-full justify-start gap-2.5 p-2 text-sm"
            >
              <span className="size-4">
                <Icon
                  name="logout"
                  className="dark:group-focus:*:stroke-foreground *:stroke-muted-foreground group-focus:*:stroke-foreground"
                />
              </span>
              <span>Logout</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
