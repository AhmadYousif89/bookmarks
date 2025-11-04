"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export const ProfileModal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const isProfilePage = pathname === "/dashboard/profile";

  useEffect(() => {
    setOpen(isProfilePage);
  }, [isProfilePage]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      router.back();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-card px-2 max-sm:py-3 sm:px-4">
        <DialogTitle />
        {children}
      </DialogContent>
    </Dialog>
  );
};
