"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getSession, useSession } from "@/app/(auth)/lib/auth.client";

type Props = { children: React.ReactNode };

export function SessionGuard({ children }: Props) {
  const pathname = usePathname();
  const inFlightRef = useRef(false);
  const [open, setOpenChange] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { data, isPending } = useSession();
  const sessionExists = !!data?.session;

  useEffect(() => {
    if (isPending) return; // Don't check while session is loading
    if (!sessionExists) {
      console.log("No session exists, opening dialog", sessionExists);
      setOpenChange(true);
      return;
    }

    const checkStatus = async () => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;

      try {
        const session = await getSession();
        if (!session) {
          setOpenChange(true);
        }
      } catch (err) {
        console.error("Error checking auth status", err);
        setOpenChange(true); // Assume session expired if error
      } finally {
        inFlightRef.current = false;
      }
    };

    checkStatus(); // Initial check on mount/pathname change
    const handleActivity = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(checkStatus, 3000);
    };

    // Check when tab becomes active
    const onVisibility = () => {
      if (document.visibilityState === "visible") checkStatus();
    };

    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname, sessionExists, isPending]);

  return (
    <>
      {children}
      <Dialog open={open}>
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
    </>
  );
}
