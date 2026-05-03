"use client";

import Link from "next/link";
import { Container } from "./container";
import { useI18n } from "@/lib/i18n/provider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <Container className="grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="text-lg font-extrabold text-brand-700">{t.footer.brand}</div>
          <p className="mt-2 text-sm leading-6 text-muted">{t.footer.tagline}</p>
        </div>
        <FooterCol title={t.footer.forBuyers}>
          <FooterLink href="/listings">{t.nav.listings}</FooterLink>
          <FooterLink href="/map">{t.nav.map}</FooterLink>
          <FooterLink href="/matching">{t.nav.matching}</FooterLink>
          <FooterLink href="/favorites">{t.nav.favorites}</FooterLink>
        </FooterCol>
        <FooterCol title={t.footer.forSellers}>
          <FooterLink href="/post">{t.nav.post}</FooterLink>
          <FooterLink href="/agencies">{t.nav.agencies}</FooterLink>
          <FooterLink href="/signup">{t.nav.signup}</FooterLink>
        </FooterCol>
        <FooterCol title={t.footer.company}>
          <FooterLink href="/about">{t.common.about}</FooterLink>
          <FooterLink href="/contact">{t.footer.contact}</FooterLink>
        </FooterCol>
      </Container>
      <div className="border-t border-line">
        <Container className="py-4 text-center text-xs text-muted">{t.footer.legal}</Container>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-soft">{title}</div>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-ink-soft hover:text-brand-700">
        {children}
      </Link>
    </li>
  );
}
