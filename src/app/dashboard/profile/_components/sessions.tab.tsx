"use client";

import { useState } from "react";
import { Session } from "better-auth";
import { UAParser } from "ua-parser-js";
import { useRouter } from "next/navigation";
import { LogOut, Trash2 } from "lucide-react";
import { signOut, authClient } from "@/app/(auth)/lib/auth.client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ActionButton } from "@/components/action.button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  isDemo: boolean;
  sessions: Session[];
  currentSessionToken: string;
};

export function SessionsTab({ isDemo, sessions, currentSessionToken }: Props) {
  const router = useRouter();
  const [isRevokingAll, setIsRevokingAll] = useState(false);

  const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);
  const currentSession = sessions.find((s) => s.token === currentSessionToken);

  const revokeOtherSessions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRevokingAll(true);
    try {
      await authClient.revokeOtherSessions(undefined, {
        onSuccess: () => {
          router.refresh();
        },
      });
    } finally {
      setIsRevokingAll(false);
    }
  };

  const sessionCount = sessions.length;

  return (
    <Card className="border-none p-5 max-sm:gap-3">
      <CardHeader className="bg-muted rounded-md py-4">
        <CardTitle className="gap-2">
          Active sessions <Badge>{sessionCount}</Badge>
        </CardTitle>
        <CardDescription>Manage your active sessions on other devices.</CardDescription>
      </CardHeader>

      {currentSession && <SessionCard session={currentSession} isDemo={isDemo} isCurrentSession />}
      <Separator />

      <CardContent className="grid gap-2 px-0">
        {otherSessions.length === 0 ? (
          <CardDescription className="text-muted-foreground p-4 text-center text-sm">
            No other active sessions found.
          </CardDescription>
        ) : (
          <ScrollArea className="max-h-25 w-full">
            {otherSessions.map((session) => (
              <SessionCard key={session.token} isDemo={isDemo} session={session} className="mb-1" />
            ))}
          </ScrollArea>
        )}
        {otherSessions.length > 0 && (
          <form className="mt-6" onSubmit={revokeOtherSessions}>
            <ActionButton
              type="submit"
              variant="destructive"
              isPending={isRevokingAll}
              disabled={isDemo || isRevokingAll}
              className="w-auto text-sm"
            >
              Revoke all other sessions
            </ActionButton>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

const SessionCard = ({
  isDemo,
  session,
  isCurrentSession = false,
  className,
}: {
  isDemo?: boolean;
  session: Session;
  isCurrentSession?: boolean;
  className?: string;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  const getBrowserInformation = () => {
    if (userAgentInfo == null) return "Unknown Device";
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
      return "Unknown Device";
    }

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

    return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`;
  };

  const revokeSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await authClient.revokeSession(
        { token: session.token },
        {
          onSuccess: () => {
            router.refresh();
          },
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent
      className={cn(
        "border-border flex justify-between gap-2 rounded-md border px-2 py-4 sm:px-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="bg-muted grid aspect-square size-10 place-items-center rounded-full">
          {userAgentInfo?.device.type === "mobile" ? <Smartphone /> : <Monitor />}
        </span>
        <div className="text-muted-foreground space-y-2 text-xs">
          <p className="text-foreground font-medium md:text-sm">{getBrowserInformation()}</p>
          <div className="grid">
            <span className="truncate">Ip address: {session.ipAddress || "Unknown"}</span>
            <span>
              Expires:{" "}
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(session.expiresAt)}
            </span>
          </div>
        </div>
      </div>
      <div className={cn("grid gap-4", isCurrentSession ? "" : "self-end")}>
        {isCurrentSession && (
          <Badge className="dark:bg-muted cursor-default font-semibold">
            Current <span className="hidden sm:block">session</span>
          </Badge>
        )}
        {!isCurrentSession ? (
          <form onSubmit={revokeSession} className="mt-auto">
            <ActionButton
              type="submit"
              size="sm"
              variant="destructive"
              title="Revoke session"
              disabled={isDemo || isLoading}
              isPending={isLoading}
              className="w-auto gap-0 text-sm"
            >
              <Trash2 className="sm:mr-2" />
              <span className="hidden sm:block">Revoke session</span>
            </ActionButton>
          </form>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            onClick={signOut}
            className="w-auto justify-self-end text-sm"
          >
            <LogOut className="text-white" /> <span className="hidden sm:block">Logout</span>
          </Button>
        )}
      </div>
    </CardContent>
  );
};

const Smartphone = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    className="fill-muted-foreground"
  >
    <path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v124q18 7 29 22t11 34v80q0 19-11 34t-29 22v404q0 33-23.5 56.5T680-40H280Zm0-80h400v-720H280v720Zm0 0v-720 720Zm200-600q17 0 28.5-11.5T520-760q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760q0 17 11.5 28.5T480-720Z" />
  </svg>
);

const Monitor = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    className="fill-muted-foreground"
  >
    <path d="M320-360h320v-22q0-45-44-71.5T480-480q-72 0-116 26.5T320-382v22Zm160-160q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520ZM320-120v-80H160q-33 0-56.5-23.5T80-280v-480q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v480q0 33-23.5 56.5T800-200H640v80H320ZM160-280h640v-480H160v480Zm0 0v-480 480Z" />
  </svg>
);
