import { Logo } from "@/components/logo";

export default function LoadingPage() {
  return (
    <div className="grid h-dvh items-center justify-center">
      <Logo className="animate-pulse lg:scale-150" />
    </div>
  );
}
