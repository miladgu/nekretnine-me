"use client";

import Link from "next/link";
import { Scale, Trash2, X } from "lucide-react";
import { Container } from "@/components/container";
import { useI18n } from "@/lib/i18n/provider";
import { useSaved, COMPARE_MAX } from "@/lib/store/saved";
import { findAgencyById } from "@/data/agencies";
import { LISTINGS } from "@/data/listings";
import { formatPrice } from "@/lib/utils";

export default function ComparePage() {
  const { t, locale } = useI18n();
  const { compare, clearComp, toggleComp, hydrated } = useSaved();
  const items = LISTINGS.filter((l) => compare.includes(l.id));

  const rows: { label: string; value: (l: typeof items[number]) => React.ReactNode }[] = [
    {
      label: t.listing.deal,
      value: (l) => t.listing[l.deal],
    },
    {
      label: t.listing.type,
      value: (l) => t.listing[l.type],
    },
    {
      label: "Price",
      value: (l) => (
        <span className="font-semibold text-ink">
          {formatPrice(l.price)}
          {l.deal === "rent" && <span className="text-muted-soft"> {t.listing.perMonth}</span>}
        </span>
      ),
    },
    {
      label: t.listing.location,
      value: (l) => l.location.city,
    },
    {
      label: t.listing.area,
      value: (l) => `${l.area} ${t.listing.sqm}`,
    },
    {
      label: t.filter.bedrooms,
      value: (l) => (l.beds > 0 ? l.beds : "—"),
    },
    {
      label: "Bathrooms",
      value: (l) => (l.baths > 0 ? l.baths : "—"),
    },
    {
      label: `€/${t.listing.sqm}`,
      value: (l) => (l.area > 0 ? `€${Math.round(l.price / l.area)}` : "—"),
    },
    {
      label: t.listing.agency,
      value: (l) => (l.agencyId ? findAgencyById(l.agencyId)?.name ?? "—" : l.ownerName ?? "Private"),
    },
    {
      label: t.listing.features,
      value: (l) => (
        <div className="flex flex-wrap gap-1">
          {l.features.map((f) => (
            <span key={f} className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] text-brand-700">
              {f}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Container className="py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          {t.nav.compare}{" "}
          <span className="text-muted-soft">
            ({hydrated ? items.length : 0}/{COMPARE_MAX})
          </span>
        </h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearComp}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-line-soft"
          >
            <Trash2 className="size-4" /> {t.filter.clear}
          </button>
        )}
      </div>

      {!hydrated ? (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-16 text-center text-sm text-muted">
          {t.common.loading}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-surface p-16 text-center">
          <Scale className="mx-auto size-8 text-muted-soft" />
          <p className="mt-3 text-sm text-muted">Add up to {COMPARE_MAX} properties to compare side by side.</p>
          <Link
            href="/listings"
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            {t.nav.listings}
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-44 border-b border-line px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-soft">
                  &nbsp;
                </th>
                {items.map((l) => (
                  <th key={l.id} className="min-w-[200px] border-b border-line p-3 text-left">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleComp(l.id)}
                        className="absolute right-1 top-1 inline-flex size-7 items-center justify-center rounded-full bg-white/90 text-ink-soft hover:bg-white"
                        aria-label="Remove"
                      >
                        <X className="size-4" />
                      </button>
                      <Link href={`/listings/${l.id}`} className="block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={l.image}
                          alt=""
                          className="mb-2 h-28 w-full rounded-lg object-cover"
                        />
                        <div className="line-clamp-1 text-sm font-semibold text-ink">{l.title[locale]}</div>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ label, value }) => (
                <tr key={label} className="border-b border-line-soft last:border-b-0">
                  <td className="px-4 py-3 text-[12px] font-semibold text-muted-soft">{label}</td>
                  {items.map((l) => (
                    <td key={l.id} className="px-3 py-3 align-top text-sm text-ink-soft">
                      {value(l)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
