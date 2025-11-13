"use client";

import { UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Session } from "@/app/(auth)/lib/auth.client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const ProfileHeader = ({ user }: { user: Session["user"] }) => {
  const isdemo = user.isDemo || false;

  return (
    <Card className="flex-row items-start justify-between gap-4 border-none p-4 shadow-none md:p-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary dark:bg-accent flex size-10 items-center justify-center rounded-full">
          <UserIcon className="size-6 text-white" />
        </div>

        <div>
          <h2 className="text-lg font-bold">{user.name}</h2>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="dark:bg-muted cursor-default text-center whitespace-normal">
            {user.role}
          </Badge>
        </TooltipTrigger>
        <TooltipContent showArrow align="end">
          {isdemo ? "Demo account with limited access." : "Basic account"}
        </TooltipContent>
      </Tooltip>
    </Card>
  );
};
