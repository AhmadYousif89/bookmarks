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
      <HomeHeader />
      <HeroSection />
      <FeatureSection />
    </main>
  );
}
