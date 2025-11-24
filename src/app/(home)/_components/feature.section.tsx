import { cn } from "@/lib/utils";
import { Zap, Tag, Search, Cloud, Palette, Lock } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Save bookmarks instantly with our browser extension. One click and you're done.",
  },
  {
    icon: Tag,
    title: "Smart Tags",
    desc: "AI-powered tagging automatically categorizes your bookmarks for easy retrieval.",
  },
  {
    icon: Search,
    title: "Advanced Search",
    desc: "Find anything in milliseconds with full-text search and intelligent filters.",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    desc: "Access your bookmarks anywhere, on any device. Everything stays in sync.",
  },
  {
    icon: Palette,
    title: "Beautiful UI",
    desc: "A delightful interface that makes organizing bookmarks actually enjoyable.",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    desc: "Your data is encrypted and only accessible by you. Privacy first, always.",
  },
];

export const FeatureSection = () => {
  return (
    <section id="features" className="site:p-0 site:pb-24 max-w-site mx-auto w-full p-8 lg:pb-20">
      <h2 className="mb-8 text-center text-xl font-bold md:mb-16 lg:text-[2.5rem]">
        Powerful Features
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {FEATURES.map((feature, idx) => (
          <div
            key={idx}
            style={{ animationDelay: `${idx * 0.1}s` }}
            className={cn(
              "bg-card group row-span-3 grid cursor-default grid-rows-subgrid gap-0 overflow-hidden",
              "rounded-2xl border-2 border-transparent p-5 transition-all duration-300",
              "hover:border-ring/50 hover:-translate-y-2 hover:shadow-xl",
              "active:border-ring/50 active:-translate-y-2 active:shadow-xl",
              "animate-fade-in-blur",
            )}
          >
            <div
              className={cn(
                "absolute inset-0 -z-10 opacity-0 transition-opacity duration-300",
                "from-primary/5 dark:to-background bg-linear-to-bl to-white",
                "group-hover:opacity-100 group-active:opacity-100",
              )}
            />
            <div className="bg-primary dark:bg-accent mb-4 flex size-10 items-center justify-center rounded-lg shadow">
              <feature.icon className="dark:text-muted-foreground size-5 text-white" />
            </div>
            <h3 className="mb-2 text-base leading-1.5 font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
