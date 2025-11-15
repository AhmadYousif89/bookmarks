import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type UserBadgeProps = {
  isDemo?: boolean;
  children: React.ReactNode;
};

export const UserBadge = ({ isDemo, children }: UserBadgeProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className="dark:bg-muted cursor-default text-center whitespace-normal">
          {children}
        </Badge>
      </TooltipTrigger>
      <TooltipContent showArrow align="end">
        {isDemo ? "Demo account with limited access." : "Basic account"}
      </TooltipContent>
    </Tooltip>
  );
};
