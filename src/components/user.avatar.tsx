import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "../app/dashboard/_lib/util";

export const UserAvatar = ({ name, image }: { name: string; image?: string }) => {
  const initials = getUserInitials(name);

  return (
    <Avatar key={image || "fallback"} className="bg-background pointer-events-none size-10">
      {image ? (
        <AvatarImage
          src={image}
          alt={`${name} avatar`}
          className="rounded-full bg-transparent object-cover"
        />
      ) : (
        <AvatarFallback>{initials}</AvatarFallback>
      )}
    </Avatar>
  );
};
