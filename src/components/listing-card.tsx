"use client";

import Link from "next/link";
import { Bath, Bed, Heart, MapPin, Ruler, Scale } from "lucide-react";
import type { Listing } from "@/types";
import { findAgencyById } from "@/data/agencies";
import { useI18n } from "@/lib/i18n/provider";
import { useSaved } from "@/lib/store/saved";
import { cn, formatPrice } from "@/lib/utils";

type Variant = "grid" | "list" | "compact";

export function ListingCard({ listing, variant = "grid" }: { listing: Listing; variant?: Variant }) {
  const { t, locale } = useI18n();
  const { isFav, isComp, toggleFav, toggleComp } = useSaved();
  const agency = listing.agencyId ? findAgencyById(listing.agencyId) : null;
  const fav = isFav(listing.id);
  const cmp = isComp(listing.id);

  const isList = variant === "list";

  return (
    <Link
      href={`/listings/${listing.id}`}
      className={cn(
        "group block overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface transition-all",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]",
        isList && "flex flex-col sm:flex-row",
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-line-soft",
          isList ? "aspect-[4/3] sm:aspect-auto sm:h-auto sm:w-[260px] sm:flex-none" : "aspect-[4/3]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.image}
          alt=""
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white",
              listing.deal === "sale" ? "bg-brand-700" : "bg-accent-600",
            )}
          >
            {t.listing[listing.deal]}
          </span>
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink-soft">
            {t.listing[listing.type]}
          </span>
        </div>
        <div className="absolute right-3 top-3 flex gap-1.5">
          <IconAction
            label={fav ? t.common.saved : t.common.save}
            active={fav}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFav(listing.id);
            }}
          >
            <Heart className={cn("size-4", fav && "fill-current")} />
          </IconAction>
          <IconAction
            label={cmp ? t.common.inCompare : t.common.addToCompare}
            active={cmp}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleComp(listing.id);
            }}
          >
            <Scale className="size-4" />
          </IconAction>
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col p-4", isList && "sm:p-5")}>
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-xl font-bold text-ink">
            {formatPrice(listing.price)}
            {listing.deal === "rent" && (
              <span className="ml-1 text-sm font-normal text-muted">{t.listing.perMonth}</span>
            )}
          </div>
        </div>
        <div className="mt-1 line-clamp-1 text-sm font-medium text-ink-soft">{listing.title[locale]}</div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted">
          <MapPin className="size-3.5" />
          {listing.location.city}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
          {listing.beds > 0 && (
            <span className="inline-flex items-center gap-1">
              <Bed className="size-3.5" /> {listing.beds} {t.listing.beds}
            </span>
          )}
          {listing.baths > 0 && (
            <span className="inline-flex items-center gap-1">
              <Bath className="size-3.5" /> {listing.baths} {t.listing.baths}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Ruler className="size-3.5" /> {listing.area} {t.listing.sqm}
          </span>
        </div>
        {agency && (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-soft">
            <span
              className="inline-flex size-5 items-center justify-center rounded-full text-[10px]"
              style={{ background: `${agency.color}1f` }}
            >
              {agency.logo}
            </span>
            {agency.name}
          </div>
        )}
        {!agency && listing.ownerKind === "private" && (
          <div className="mt-3 text-[11px] text-muted-soft">{listing.ownerName ?? "Private seller"}</div>
        )}
      </div>
    </Link>
  );
}

function IconAction({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full transition-all",
        active ? "bg-brand-700 text-white" : "bg-white/90 text-ink-soft hover:bg-white",
      )}
    >
      {children}
    </button>
  );
}
