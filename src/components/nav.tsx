"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Scale, X } from "lucide-react";
import { useState } from "react";
import { Container } from "./container";
import { LangSwitcher } from "./lang-switcher";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  match?: (path: string) => boolean;
}

export function Nav() {
  const { t } = useI18n();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const items: NavItem[] = [
    { href: "/",          label: t.nav.home,     match: (p) => p === "/" },
    { href: "/listings",  label: t.nav.listings, match: (p) => p.startsWith("/listings") },
    { href: "/map",       label: t.nav.map },
    { href: "/agencies",  label: t.nav.agencies, match: (p) => p.startsWith("/agencies") },
    { href: "/matching",  label: t.nav.matching },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <Container className="flex h-15 items-center justify-between gap-4 py-3">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="whitespace-nowrap text-[22px] font-extrabold tracking-tight text-brand-700">
            {t.brand}
          </Link>
          <nav className="hidden gap-1 lg:flex">
            {items.map((item) => {
              const active = item.match ? item.match(path) : path === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-muted hover:bg-brand-50 hover:text-brand-700",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/favorites"
            aria-label={t.nav.favorites}
            className={cn(
              "hidden size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-brand-50 hover:text-brand-700 sm:inline-flex",
              path === "/favorites" && "text-brand-700",
            )}
          >
            <Heart className="size-4" />
          </Link>
          <Link
            href="/compare"
            aria-label={t.nav.compare}
            className={cn(
              "hidden size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-brand-50 hover:text-brand-700 sm:inline-flex",
              path === "/compare" && "text-brand-700",
            )}
          >
            <Scale className="size-4" />
          </Link>
          <Link
            href="/post"
            className="hidden whitespace-nowrap rounded-lg bg-brand-700 px-3 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-800 sm:inline-flex"
          >
            {t.nav.post}
          </Link>
          <Link
            href="/signin"
            className="hidden whitespace-nowrap rounded-lg border border-line px-3 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:bg-line-soft sm:inline-flex"
          >
            {t.nav.signin}
          </Link>
          <LangSwitcher />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
            className="-mr-1 inline-flex items-center justify-center rounded-md p-1.5 text-ink-soft lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-line bg-surface lg:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-ink hover:bg-line-soft"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-line" />
            <Link
              href="/favorites"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-ink hover:bg-line-soft"
            >
              {t.nav.favorites}
            </Link>
            <Link
              href="/compare"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-ink hover:bg-line-soft"
            >
              {t.nav.compare}
            </Link>
            <Link
              href="/signin"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-ink hover:bg-line-soft"
            >
              {t.nav.signin}
            </Link>
            <Link
              href="/post"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-brand-700 px-3 py-2 text-center text-sm font-semibold text-white"
            >
              {t.nav.post}
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
