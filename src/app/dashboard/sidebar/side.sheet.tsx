"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { SideSheetTags } from "./tags.client";
import { SideSheetLinks } from "./links.client";
import { Logo } from "@/components/logo";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const SideSheet = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (pathname) setIsOpen(false);
  }, [pathname]);

  const closeSheet = useCallback(() => setIsOpen(false), []);

  const sheetContent = (
    <>
      <div className="p-5 pb-2.5 lg:hidden">
        <Logo closeSheet={closeSheet} useAnchor />
      </div>
      <div className="hidden p-5 pb-2.5 lg:block">
        <Logo closeSheet={closeSheet} />
      </div>
      <div className="flex grow flex-col gap-4 px-4 pb-5">
        <SideSheetLinks />
        <SideSheetTags />
      </div>
    </>
  );

  return (
    <>
      <nav className="absolute top-3.5 left-4 z-50 md:top-5 md:left-8 lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="secondary" size="icon">
              <Icon name="menu-hamburger" className="dark:*:stroke-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent className="max-w-sidebar lg:hidden" side="left">
            <SheetTitle aria-hidden />
            {sheetContent}
          </SheetContent>
        </Sheet>
      </nav>

      <nav className="bg-card max-w-sidebar hidden w-full flex-col gap-4 lg:flex">
        {sheetContent}
      </nav>
    </>
  );
};
