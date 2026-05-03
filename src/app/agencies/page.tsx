"use client";

import Link from "next/link";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { Container } from "@/components/container";
import { useI18n } from "@/lib/i18n/provider";
import { listAgencies } from "@/data/queries";

export default function AgenciesPage() {
  const { t, locale } = useI18n();
  const agencies = listAgencies();

  return (
    <Container className="py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t.nav.agencies}</h1>
        <p className="mt-1 text-sm text-muted">{agencies.length} agencies on Nekretnine.me</p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {agencies.map((a) => (
          <Link
            key={a.id}
            href={`/agencies/${a.slug}`}
            className="group overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-xl text-2xl"
                style={{ background: `${a.color}1f` }}
              >
                {a.logo}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-bold text-ink">{a.name}</span>
                  {a.verified && <CheckCircle2 className="size-4 text-brand-700" />}
                </div>
                <div className="text-xs text-muted">
                  {a.listingsCount} {t.nav.listings.toLowerCase()}
                </div>
              </div>
            </div>
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-soft">
              {a.description[locale]}
            </p>
            <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <Phone className="size-3.5" /> {a.phone}
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="size-3.5" /> {a.email}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
