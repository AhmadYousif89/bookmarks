"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SessionGuardModal({ isOpen }: { isOpen: boolean }) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="gap-8"
      >
        <DialogHeader>
          <DialogTitle className="text-lg">Session Expired</DialogTitle>
          <DialogDescription>
            Your session has expired. Please sign in again to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button asChild className="h-10.5">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
