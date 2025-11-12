import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Manrope, Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["400", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookmark Manager",
  description: "Save and manage your bookmarks with Bookmark Manager.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${roboto.variable} antialiased`}>
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#4C5C5920_1px,transparent_1px),linear-gradient(to_bottom,#4C5C5920_1px,transparent_1px)] bg-size-[25px_25px]"
            style={{
              maskImage: "radial-gradient(ellipse 50% 55% at 50% 55%, #000 50%, transparent 95%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 50% 55% at 50% 55%, #000 50%, transparent 95%)",
            }}
          />
        </div>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <>{children}</>
          <Toaster
            offset={90}
            mobileOffset={20}
            position="top-center"
            toastOptions={{
              classNames: {
                content: "text-left!",
                title: "text-sm/normal font-medium",
                description: "text-xs font-medium text-muted-foreground",
              },
              style: {
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "8px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
