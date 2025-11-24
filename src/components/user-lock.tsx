import { cn } from "@/lib/utils";
import { LockKeyhole } from "lucide-react";

export const UserLockIcon = ({ className }: { className?: string }) => (
  <span
    title="Users only"
    className={cn("bg-accent grid aspect-square place-items-center rounded-full p-0.5", className)}
  >
    <LockKeyhole />
  </span>
);
