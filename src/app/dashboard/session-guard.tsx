"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getSession, useSession } from "@/app/(auth)/lib/auth.client";
import { SessionGuardModal } from "./session-guard.modal";

type Props = { children: React.ReactNode };

export function SessionGuard({ children }: Props) {
  const pathname = usePathname();
  const inFlightRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const { data } = useSession();

  useEffect(() => {
    if (!data?.session) return;

    const checkStatus = async () => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;

      try {
        const session = await getSession();
        if (session.data == null) {
          setShowExpiredModal(true);
        }
      } catch (err) {
        console.error("Error checking auth status", err);
        setShowExpiredModal(true); // Assume session expired if error
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
      clearTimeout(timeoutRef.current);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname, data?.session]);

  return (
    <>
      {children}
      <SessionGuardModal isOpen={showExpiredModal} />
    </>
  );
}
