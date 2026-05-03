"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Info, Layers } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { listListings } from "@/data/queries";
import { findAgencyById } from "@/data/agencies";
import type { BasemapKey } from "@/lib/map/sources";
import type { DealKind } from "@/types";
import { cn, formatPrice } from "@/lib/utils";

// MapLibre touches `window` on import — load it client-only with no SSR
const MapView = dynamic(
  () => import("@/components/map/map-view").then((m) => m.MapView),
  { ssr: false, loading: () => <div className="size-full bg-line-soft" /> },
);

export default function MapPage() {
  const { t, locale } = useI18n();
  const [basemap, setBasemap] = useState<BasemapKey>("streets");
  const [dealFilter, setDealFilter] = useState<DealKind | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [layersOpen, setLayersOpen] = useState(true);

  const listings = useMemo(
    () => listListings({ deal: dealFilter === "all" ? "all" : dealFilter }),
    [dealFilter],
  );

  const sideList = useMemo(() => {
    if (selected) {
      const one = listings.find((l) => l.id === selected);
      return one ? [one] : [];
    }
    return listings.slice(0, 30);
  }, [listings, selected]);

  return (
    <div className="flex h-[calc(100vh_-_3.75rem)] flex-col overflow-hidden lg:flex-row">
      {/* Map */}
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <MapView
          listings={listings}
          basemap={basemap}
          selectedId={selected}
          onSelect={setSelected}
          locale={locale}
        />

        {/* Top filter bar */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 p-3">
          <div className="pointer-events-auto mx-auto flex w-fit gap-1 rounded-full border border-line bg-surface/95 p-1 shadow-[var(--shadow-card)] backdrop-blur">
            <DealPill active={dealFilter === "all"} onClick={() => setDealFilter("all")}>
              {t.filter.all}
            </DealPill>
            <DealPill active={dealFilter === "sale"} onClick={() => setDealFilter("sale")} accent="brand">
              {t.listing.sale}
            </DealPill>
            <DealPill active={dealFilter === "rent"} onClick={() => setDealFilter("rent")} accent="accent">
              {t.listing.rent}
            </DealPill>
          </div>
        </div>

        {/* Layer switcher */}
        <div className="pointer-events-none absolute bottom-4 right-4">
          <div className="pointer-events-auto rounded-xl border border-line bg-surface/95 shadow-[var(--shadow-card-hover)] backdrop-blur">
            <button
              type="button"
              onClick={() => setLayersOpen((s) => !s)}
              className="flex w-full items-center justify-between gap-2 px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-line-soft"
            >
              <span className="inline-flex items-center gap-2">
                <Layers className="size-4 text-brand-700" /> {t.map.layers}
              </span>
              <ChevronRight
                className={cn("size-4 text-muted-soft transition-transform", layersOpen && "rotate-90")}
              />
            </button>
            {layersOpen && (
              <div className="border-t border-line p-2">
                <div className="space-y-1">
                  <BaseRadio
                    label={t.map.streets}
                    checked={basemap === "streets"}
                    onChange={() => setBasemap("streets")}
                  />
                  <BaseRadio
                    label={t.map.ortofoto}
                    checked={basemap === "ortofoto"}
                    onChange={() => setBasemap("ortofoto")}
                  />
                  <BaseRadio
                    label={t.map.topo}
                    checked={basemap === "topo"}
                    onChange={() => setBasemap("topo")}
                  />
                </div>
                <div className="mt-2 border-t border-line pt-2">
                  <div className="flex items-start gap-2 rounded-lg bg-line-soft px-2.5 py-2 text-[11px] leading-snug text-muted">
                    <Info className="mt-px size-3.5 shrink-0 text-muted-soft" />
                    <div>
                      <div className="font-semibold text-ink-soft">{t.map.cadastre}</div>
                      <div className="mt-0.5">{t.map.cadastreUnavailable}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="pointer-events-none absolute bottom-4 left-4">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-line bg-surface/95 px-3 py-1.5 text-[11px] text-ink-soft shadow-[var(--shadow-card)] backdrop-blur">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-brand-700" /> {t.listing.sale}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-accent-600" /> {t.listing.rent}
            </span>
          </div>
        </div>
      </div>

      {/* Side list */}
      <aside className="hidden w-[360px] flex-none flex-col border-l border-line bg-surface lg:flex">
        <header className="flex items-center justify-between border-b border-line px-4 py-3">
          <div>
            <div className="text-sm font-semibold text-ink">
              {selected ? "Selected" : `${listings.length} ${t.filter.results}`}
            </div>
            {selected && (
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-xs text-brand-700 hover:underline"
              >
                ← Show all
              </button>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {sideList.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted">{t.filter.noResults}</div>
          ) : (
            <ul className="divide-y divide-line">
              {sideList.map((l) => {
                const ag = l.agencyId ? findAgencyById(l.agencyId) : null;
                return (
                  <li key={l.id}>
                    <Link
                      href={`/listings/${l.id}`}
                      className="flex gap-3 p-3 transition-colors hover:bg-line-soft"
                      onMouseEnter={() => setSelected(l.id)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={l.image}
                        alt=""
                        className="size-20 flex-none rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white",
                              l.deal === "sale" ? "bg-brand-700" : "bg-accent-600",
                            )}
                          >
                            {t.listing[l.deal]}
                          </span>
                          <span className="text-[10px] text-muted-soft">{t.listing[l.type]}</span>
                        </div>
                        <div className="mt-1 truncate text-sm font-bold text-ink">
                          {formatPrice(l.price)}
                          {l.deal === "rent" && (
                            <span className="text-xs font-normal text-muted-soft"> {t.listing.perMonth}</span>
                          )}
                        </div>
                        <div className="truncate text-xs text-muted">{l.location.city}</div>
                        {ag && (
                          <div className="mt-1 truncate text-[10px] text-muted-soft">{ag.name}</div>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

function DealPill({
  active,
  accent,
  onClick,
  children,
}: {
  active: boolean;
  accent?: "brand" | "accent";
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
        active
          ? accent === "accent"
            ? "bg-accent-600 text-white"
            : "bg-brand-700 text-white"
          : "text-ink-soft hover:bg-line-soft",
      )}
    >
      {children}
    </button>
  );
}

function BaseRadio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
        checked ? "bg-brand-50 text-brand-700" : "text-ink-soft hover:bg-line-soft",
      )}
    >
      <span
        className={cn(
          "inline-block size-3.5 rounded-full border",
          checked ? "border-brand-700 bg-brand-700 ring-2 ring-white ring-inset" : "border-line",
        )}
      />
      {label}
    </button>
  );
}
