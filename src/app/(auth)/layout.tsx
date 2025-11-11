import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "./lib/auth";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Grid BG */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#4C5C5925_1px,transparent_1px),linear-gradient(to_bottom,#4C5C5925_1px,transparent_1px)] bg-size-[30px_30px]"
          style={{
            maskImage: "radial-gradient(ellipse 60% 55% at 50% 55%, #000 50%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 55% at 50% 55%, #000 50%, transparent 100%)",
          }}
        />
      </div>
      <Card className="w-full max-w-md gap-8 border-none px-5 py-8 sm:px-8 sm:py-10">
        <Logo />
        {children}
      </Card>
    </main>
  );
}
