"use client";

import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Globe, Mail, Phone } from "lucide-react";
import { Container } from "@/components/container";
import { ListingCard } from "@/components/listing-card";
import { useI18n } from "@/lib/i18n/provider";
import { getAgencyBySlug, getListingsByAgency } from "@/data/queries";

export default function AgencyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const agency = getAgencyBySlug(slug);
  const { t, locale } = useI18n();

  if (!agency) return notFound();
  const listings = getListingsByAgency(agency.id);

  return (
    <Container className="py-8">
      <Link
        href="/agencies"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
      >
        <ArrowLeft className="size-4" /> {t.common.back}
      </Link>

      <header className="mt-4 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div
          className="flex size-20 items-center justify-center rounded-2xl text-4xl"
          style={{ background: `${agency.color}1f` }}
        >
          {agency.logo}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink">{agency.name}</h1>
            {agency.verified && <CheckCircle2 className="size-5 text-brand-700" />}
          </div>
          <p className="mt-1 text-sm text-muted">
            {agency.listingsCount} {t.nav.listings.toLowerCase()}
          </p>
        </div>
      </header>

      <section className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <h2 className="text-base font-semibold text-ink">{t.common.about}</h2>
        <p className="mt-2 text-sm leading-7 text-ink-soft">{agency.description[locale]}</p>
        <div className="mt-5 grid gap-3 text-sm text-ink-soft sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Phone className="size-4 text-muted-soft" /> {agency.phone}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-muted-soft" /> {agency.email}
          </div>
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-muted-soft" /> {agency.website}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-5 text-xl font-bold tracking-tight text-ink">
          {t.nav.listings} ({listings.length})
        </h2>
        {listings.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-surface p-12 text-center text-sm text-muted">
            No active listings.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
