import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAvatar = ({ name, image }: { name: string; image?: string }) => {
  const userInitials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Avatar className="size-10">
      {image ? (
        <>
          <AvatarImage src={image} alt={`${name}'s Avatar`} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </>
      ) : (
        <>
          <AvatarImage src="/assets/images/image-avatar.webp" alt="Default Avatar" />
          <AvatarFallback />
        </>
      )}
    </Avatar>
  );
};
