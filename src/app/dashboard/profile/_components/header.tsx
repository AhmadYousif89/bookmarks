"use client";

import { UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/app/(auth)/lib/auth.client";

export const ProfileHeader = () => {
  const { data, isPending } = useSession();

  return (
    <Card className="flex-row items-start justify-between gap-4 border-none p-4 shadow-none md:p-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary dark:bg-accent flex size-10 items-center justify-center rounded-full">
          <UserIcon className="size-6 text-white" />
        </div>
        {isPending && !data?.user ? (
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
      {isPending && !data?.user ? (
        <Skeleton className="h-6 w-14" />
      ) : (
        <Badge className="dark:bg-muted cursor-default">{data?.user.role}</Badge>
      )}
    </Card>
  );
};
