import { Logo } from "@/components/logo";

export default function LoadingPage() {
  return (
    <div className="relative grid h-dvh items-center justify-center">
      <Logo className="animate-pulse lg:scale-150" />
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
    </div>
  );
}
