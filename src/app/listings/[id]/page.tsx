"use client";

import Link from "next/link";
import { use, useState } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, Bed, Heart, Mail, MapPin, Phone, Ruler, Scale } from "lucide-react";
import { Container } from "@/components/container";
import { ListingCard } from "@/components/listing-card";
import { useI18n } from "@/lib/i18n/provider";
import { useSaved } from "@/lib/store/saved";
import { findAgencyById } from "@/data/agencies";
import { getListing, listListings } from "@/data/queries";
import { cn, formatPrice } from "@/lib/utils";

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listing = getListing(id);
  const { t, locale } = useI18n();
  const { isFav, isComp, toggleFav, toggleComp } = useSaved();
  const [activeImage, setActiveImage] = useState(0);

  if (!listing) return notFound();

  const agency = listing.agencyId ? findAgencyById(listing.agencyId) : null;
  const fav = isFav(listing.id);
  const cmp = isComp(listing.id);
  const pricePerSqm = listing.area > 0 ? Math.round(listing.price / listing.area) : null;

  const related = listListings({
    type: listing.type,
    deal: listing.deal,
    city: listing.location.city,
  })
    .filter((l) => l.id !== listing.id)
    .slice(0, 3);

  return (
    <Container className="py-8">
      <Link
        href="/listings"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
      >
        <ArrowLeft className="size-4" /> {t.common.back}
      </Link>

      {/* Gallery */}
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px]">
        <div className="overflow-hidden rounded-[var(--radius-card)] bg-line-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.images[activeImage]}
            alt=""
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
          {listing.images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveImage(i)}
              className={cn(
                "overflow-hidden rounded-lg border-2 bg-line-soft transition",
                activeImage === i ? "border-brand-700" : "border-transparent hover:border-line",
              )}
              aria-label={`Image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="aspect-[4/3] w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                listing.deal === "sale" ? "bg-brand-50 text-brand-700" : "bg-accent-50 text-accent-700",
              )}
            >
              {t.listing[listing.deal]}
            </span>
            <span className="rounded-full bg-line-soft px-3 py-1 text-xs font-medium text-ink-soft">
              {t.listing[listing.type]}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">
            {listing.title[locale]}
          </h1>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted">
            <MapPin className="size-4" /> {listing.location.city}, Montenegro
          </div>
          <div className="mt-5 text-4xl font-extrabold text-brand-700">
            {formatPrice(listing.price)}
            {listing.deal === "rent" && (
              <span className="ml-1 text-base font-normal text-muted-soft">{t.listing.perMonth}</span>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {listing.beds > 0 && <Stat icon={<Bed className="size-4" />} value={listing.beds} label={t.listing.beds} />}
            {listing.baths > 0 && <Stat icon={<Bath className="size-4" />} value={listing.baths} label={t.listing.baths} />}
            <Stat icon={<Ruler className="size-4" />} value={`${listing.area}`} label={t.listing.sqm} />
            {pricePerSqm !== null && (
              <Stat value={`€${pricePerSqm}`} label={`€/${t.listing.sqm}`} />
            )}
          </div>

          {/* Description */}
          <section className="mt-8">
            <h2 className="text-lg font-bold text-ink">{t.listing.description}</h2>
            <p className="mt-2 text-sm leading-7 text-ink-soft">{listing.description[locale]}</p>
          </section>

          {/* Features */}
          {listing.features.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-ink">{t.listing.features}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {listing.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Side column */}
        <aside className="space-y-3">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
            {agency ? (
              <>
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-12 items-center justify-center rounded-xl text-2xl"
                    style={{ background: `${agency.color}1f` }}
                  >
                    {agency.logo}
                  </div>
                  <div>
                    <div className="font-bold text-ink">{agency.name}</div>
                    <div className="text-xs text-muted">
                      {agency.listingsCount} {t.nav.listings.toLowerCase()}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-ink-soft">{agency.description[locale]}</p>
                <div className="mt-4 space-y-2 text-sm text-ink-soft">
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-soft" /> {agency.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-soft" /> {agency.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-5 w-full rounded-xl bg-brand-700 py-3 text-sm font-semibold text-white hover:bg-brand-800"
                >
                  {t.common.contactAgency}
                </button>
                <Link
                  href={`/agencies/${agency.slug}`}
                  className="mt-2 block w-full rounded-xl bg-line-soft py-3 text-center text-sm font-semibold text-ink-soft hover:bg-line"
                >
                  {t.section.viewAll} {t.nav.listings.toLowerCase()}
                </Link>
              </>
            ) : (
              <>
                <div className="font-bold text-ink">{listing.ownerName ?? "Private seller"}</div>
                <p className="mt-2 text-sm text-muted">
                  This listing is posted by a private user. Contact via the platform.
                </p>
                <button
                  type="button"
                  className="mt-5 w-full rounded-xl bg-brand-700 py-3 text-sm font-semibold text-white hover:bg-brand-800"
                >
                  {t.common.send} {t.common.contactAgency.toLowerCase().replace("agency", "seller")}
                </button>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toggleFav(listing.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                fav
                  ? "border-brand-700 bg-brand-700 text-white hover:bg-brand-800"
                  : "border-line bg-surface text-ink-soft hover:bg-line-soft",
              )}
            >
              <Heart className={cn("size-4", fav && "fill-current")} />
              {fav ? t.common.saved : t.common.save}
            </button>
            <button
              type="button"
              onClick={() => toggleComp(listing.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                cmp
                  ? "border-brand-700 bg-brand-700 text-white hover:bg-brand-800"
                  : "border-line bg-surface text-ink-soft hover:bg-line-soft",
              )}
            >
              <Scale className="size-4" />
              {cmp ? t.common.inCompare : t.common.addToCompare}
            </button>
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-xl font-bold tracking-tight text-ink">
            {t.section.featured} — {listing.location.city}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}

function Stat({ value, label, icon }: { value: string | number; label: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-line-soft px-4 py-4 text-center">
      <div className="flex items-center justify-center gap-1.5">
        {icon && <span className="text-muted-soft">{icon}</span>}
        <span className="text-2xl font-bold text-ink">{value}</span>
      </div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-soft">{label}</div>
    </div>
  );
}
