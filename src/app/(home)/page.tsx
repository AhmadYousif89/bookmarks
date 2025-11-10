import { Metadata } from "next";

import { HomeHeader } from "./_components/header";
import { HeroSection } from "./_components/hero.section";
import { FeatureSection } from "./_components/feature.section";

export const metadata: Metadata = {
  title: "Bookmark Manager",
  description:
    "Organize and manage your bookmarks with ease. Save, categorize, and access your favorite links anytime, anywhere.",
};

export default function Home() {
  return (
    <main className="flex grow flex-col">
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
      <HomeHeader />
      <HeroSection />
      <FeatureSection />
    </main>
  );
}
