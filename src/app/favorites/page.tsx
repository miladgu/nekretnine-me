"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { Container } from "@/components/container";
import { ListingCard } from "@/components/listing-card";
import { useI18n } from "@/lib/i18n/provider";
import { useSaved } from "@/lib/store/saved";
import { LISTINGS } from "@/data/listings";

export default function FavoritesPage() {
  const { t } = useI18n();
  const { favorites, clearFavs, hydrated } = useSaved();
  const items = LISTINGS.filter((l) => favorites.includes(l.id));

  return (
    <Container className="py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          {t.nav.favorites} <span className="text-muted-soft">({hydrated ? items.length : 0})</span>
        </h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearFavs}
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
          <Heart className="mx-auto size-8 text-muted-soft" />
          <p className="mt-3 text-sm text-muted">No saved properties yet.</p>
          <Link
            href="/listings"
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            {t.nav.listings}
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </Container>
  );
}
