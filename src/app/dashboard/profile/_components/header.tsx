"use client";

import { UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/app/(auth)/lib/auth.client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const ProfileHeader = () => {
  const { data, isPending } = useSession();
  const isdemo = data?.user.isDemo;

  return (
    <Card className="flex-row items-start justify-between gap-4 border-none p-4 shadow-none md:p-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary dark:bg-accent flex size-10 items-center justify-center rounded-full">
          <UserIcon className="size-6 text-white" />
        </div>
        {isPending ? (
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold">{data?.user.name || "User Profile"}</h2>
            <p className="text-muted-foreground text-sm">{data?.user.email}</p>
          </div>
        )}
      </div>
      {isPending ? (
        <Skeleton className="h-6 w-14" />
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className="dark:bg-muted cursor-default text-center whitespace-normal">
              {data?.user.role}
            </Badge>
          </TooltipTrigger>
          <TooltipContent showArrow align="end">
            {isdemo ? "Demo account with limited access." : "Basic account"}
          </TooltipContent>
        </Tooltip>
      )}
    </Card>
  );
};
