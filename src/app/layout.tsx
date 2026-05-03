import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/provider";
import { SavedProvider } from "@/lib/store/saved";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Nekretnine.me — Montenegro real estate",
  description:
    "Montenegro's real estate marketplace. Browse, post and find apartments, houses, land and commercial properties — with AI-powered matching.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-surface-soft text-ink antialiased">
        <I18nProvider>
          <SavedProvider>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </SavedProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
