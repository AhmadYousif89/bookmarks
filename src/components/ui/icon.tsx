"use client";

import { cn } from "@/lib/utils";
import { iconMap, type AvailableIconNames } from "@/lib/icon.generated";

type SVGType = React.SVGProps<SVGSVGElement>;

type IconProps = SVGType & { name: AvailableIconNames };

export function Icon({ name, className, ...props }: IconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;

  return <IconComponent className={cn("size-fit", className)} {...props} />;
}
