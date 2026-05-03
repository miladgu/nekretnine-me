"use client";

import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Container } from "@/components/container";
import { useI18n } from "@/lib/i18n/provider";
import { getFeaturedListings, listAgencies } from "@/data/queries";
import { formatPrice } from "@/lib/utils";

export default function HomePage() {
  const { t, locale } = useI18n();
  const featured = getFeaturedListings(6);
  const agencies = listAgencies();

  return (
    <>
      {/* Hero */}
      <section
        className="text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <Container className="py-20 text-center sm:py-24">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t.heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base/relaxed text-white/85">{t.heroSub}</p>
          <form
            action="/listings"
            className="mx-auto mt-8 flex max-w-xl gap-2 rounded-2xl bg-white/15 p-1.5 backdrop-blur"
          >
            <input
              name="q"
              placeholder={t.common.search}
              className="flex-1 rounded-xl bg-white px-4 py-3 text-sm text-ink placeholder:text-muted-soft outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
            >
              <Search className="size-4" />
              {t.cta.heroSearch}
            </button>
          </form>
        </Container>
      </section>

      <Container className="py-16">
        {/* Featured */}
        <section>
          <SectionHeader title={t.section.featured} href="/listings" linkLabel={t.section.viewAll} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((l) => (
              <Link
                key={l.id}
                href={`/listings/${l.id}`}
                className="group overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-line-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={l.image}
                    alt=""
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 flex gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white ${
                        l.deal === "sale" ? "bg-brand-700" : "bg-accent-600"
                      }`}
                    >
                      {t.listing[l.deal]}
                    </span>
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink-soft">
                      {t.listing[l.type]}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xl font-bold text-ink">
                    {formatPrice(l.price)}
                    {l.deal === "rent" && <span className="ml-1 text-sm font-normal text-muted">{t.listing.perMonth}</span>}
                  </div>
                  <div className="mt-1 line-clamp-1 text-sm font-medium text-ink-soft">{l.title[locale]}</div>
                  <div className="mt-1 text-xs text-muted">{l.location.city}</div>
                  <div className="mt-3 flex gap-3 text-xs text-muted">
                    {l.beds > 0 && <span>{l.beds} {t.listing.beds}</span>}
                    {l.baths > 0 && <span>{l.baths} {t.listing.baths}</span>}
                    <span>{l.area} {t.listing.sqm}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* AI matching CTA */}
        <section className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 p-10 text-center">
          <Sparkles className="mx-auto size-7 text-brand-700" />
          <h2 className="mt-3 text-2xl font-bold text-ink">{t.cta.tryMatching}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{t.cta.tryMatchingSub}</p>
          <Link
            href="/matching"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            {t.cta.startMatching}
            <ArrowRight className="size-4" />
          </Link>
        </section>

        {/* Top agencies */}
        <section className="mt-16">
          <SectionHeader title={t.section.topAgencies} href="/agencies" linkLabel={t.section.viewAll} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {agencies.map((a) => (
              <Link
                key={a.id}
                href={`/agencies/${a.slug}`}
                className="rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div
                  className="flex size-11 items-center justify-center rounded-xl text-2xl"
                  style={{ background: `${a.color}15` }}
                >
                  {a.logo}
                </div>
                <div className="mt-3 font-semibold text-ink">{a.name}</div>
                <div className="mt-1 text-xs text-muted">
                  {a.listingsCount} {t.nav.listings.toLowerCase()}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Agency CTA */}
        <section className="mt-16 rounded-2xl border border-line bg-surface p-10 text-center">
          <h2 className="text-xl font-bold text-ink">{t.cta.forAgencies}</h2>
          <Link
            href="/signup?role=agency"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-ink-soft"
          >
            {t.nav.signup}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </Container>
    </>
  );
}

function SectionHeader({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
  return (
    <div className="mb-6 flex items-baseline justify-between">
      <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
      <Link href={href} className="text-sm font-medium text-brand-700 hover:underline">
        {linkLabel} →
      </Link>
    </div>
  );
}
