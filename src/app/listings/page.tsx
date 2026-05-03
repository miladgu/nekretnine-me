"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { Container } from "@/components/container";
import { ListingCard } from "@/components/listing-card";
import { useI18n } from "@/lib/i18n/provider";
import { listListings, type ListingFilters, type ListingSort } from "@/data/queries";
import { LOCATIONS } from "@/data/locations";
import { cn } from "@/lib/utils";
import type { DealKind, ListingType } from "@/types";

const TYPES: (ListingType | "all")[] = ["all", "apartment", "house", "land", "commercial"];
const DEALS: (DealKind | "all")[] = ["all", "sale", "rent"];

function num(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function ListingsInner() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();

  const filters: ListingFilters = useMemo(() => ({
    search: params.get("q") ?? undefined,
    type: (params.get("type") as ListingType | "all" | null) ?? "all",
    deal: (params.get("deal") as DealKind | "all" | null) ?? "all",
    city: params.get("city") ?? undefined,
    minPrice: num(params.get("minPrice")),
    maxPrice: num(params.get("maxPrice")),
    minArea: num(params.get("minArea")),
    maxArea: num(params.get("maxArea")),
    minBeds: num(params.get("minBeds")),
  }), [params]);

  const sort = (params.get("sort") as ListingSort | null) ?? "newest";
  const view = (params.get("view") as "grid" | "list" | null) ?? "grid";
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => listListings(filters, sort), [filters, sort]);

  const update = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === "" || v === "all") next.delete(k);
      else next.set(k, v);
    }
    router.replace(`/listings?${next.toString()}`, { scroll: false });
  };

  const reset = () => router.replace("/listings", { scroll: false });

  const activeFilterCount =
    (filters.type && filters.type !== "all" ? 1 : 0) +
    (filters.deal && filters.deal !== "all" ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.minArea ? 1 : 0) +
    (filters.maxArea ? 1 : 0) +
    (filters.minBeds ? 1 : 0);

  return (
    <Container className="py-8">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-soft" />
          <input
            type="search"
            placeholder={t.common.search}
            defaultValue={filters.search ?? ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") update({ q: e.currentTarget.value || undefined });
            }}
            onBlur={(e) => {
              if ((e.currentTarget.value || "") !== (filters.search ?? "")) {
                update({ q: e.currentTarget.value || undefined });
              }
            }}
            className="w-full rounded-xl border border-line bg-surface py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-soft focus:border-brand-700"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className={cn(
            "inline-flex items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
            showFilters || activeFilterCount > 0
              ? "border-brand-700 bg-brand-50 text-brand-700"
              : "border-line bg-surface text-ink-soft hover:bg-line-soft",
          )}
        >
          <SlidersHorizontal className="size-4" />
          {t.filter.filters}
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-brand-700 px-1.5 text-[10px] font-bold text-white">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-3 rounded-[var(--radius-card)] border border-line bg-surface p-4">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Field label={t.listing.type}>
              <Select value={filters.type ?? "all"} onChange={(v) => update({ type: v })}>
                {TYPES.map((tp) => (
                  <option key={tp} value={tp}>
                    {tp === "all" ? t.filter.all : t.listing[tp]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t.listing.deal}>
              <Select value={filters.deal ?? "all"} onChange={(v) => update({ deal: v })}>
                {DEALS.map((d) => (
                  <option key={d} value={d}>
                    {d === "all" ? t.filter.all : t.listing[d]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t.listing.location}>
              <Select value={filters.city ?? ""} onChange={(v) => update({ city: v || undefined })}>
                <option value="">{t.filter.all}</option>
                {LOCATIONS.map((l) => (
                  <option key={l.name} value={l.name}>{l.name}</option>
                ))}
              </Select>
            </Field>
            <Field label={t.filter.bedrooms}>
              <Select value={filters.minBeds ? String(filters.minBeds) : ""} onChange={(v) => update({ minBeds: v || undefined })}>
                <option value="">{t.filter.anyBeds}</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </Select>
            </Field>
            <Field label={t.filter.minPrice}>
              <NumInput value={filters.minPrice} onChange={(v) => update({ minPrice: v })} placeholder="€" />
            </Field>
            <Field label={t.filter.maxPrice}>
              <NumInput value={filters.maxPrice} onChange={(v) => update({ maxPrice: v })} placeholder="€" />
            </Field>
            <Field label={t.filter.minArea}>
              <NumInput value={filters.minArea} onChange={(v) => update({ minArea: v })} placeholder="m²" />
            </Field>
            <Field label={t.filter.maxArea}>
              <NumInput value={filters.maxArea} onChange={(v) => update({ maxArea: v })} placeholder="m²" />
            </Field>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-line-soft"
              >
                <X className="size-3.5" /> {t.filter.clear}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="mt-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="text-sm text-muted">
          <strong className="text-ink">{results.length}</strong> {t.filter.results}
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={sort}
            onChange={(v) => update({ sort: v === "newest" ? undefined : v })}
            className="!min-w-[150px]"
          >
            <option value="newest">{t.section.newest}</option>
            <option value="price-asc">{t.filter.minPrice} ↑</option>
            <option value="price-desc">{t.filter.maxPrice} ↓</option>
            <option value="area-desc">{t.listing.area} ↓</option>
          </Select>
          <div className="flex rounded-lg border border-line bg-surface p-1">
            <ViewBtn active={view === "grid"} onClick={() => update({ view: undefined })} label={t.common.grid}>
              <LayoutGrid className="size-4" />
            </ViewBtn>
            <ViewBtn active={view === "list"} onClick={() => update({ view: "list" })} label={t.common.list}>
              <List className="size-4" />
            </ViewBtn>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-5">
        {results.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-surface p-16 text-center">
            <Filter className="mx-auto size-8 text-muted-soft" />
            <p className="mt-3 text-sm text-muted">{t.filter.noResults}</p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
            >
              {t.filter.clear}
            </button>
          </div>
        ) : view === "list" ? (
          <div className="flex flex-col gap-3">
            {results.map((l) => (
              <ListingCard key={l.id} listing={l} variant="list" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<Container className="py-8 text-sm text-muted">…</Container>}>
      <ListingsInner />
    </Suspense>
  );
}

// ── small inline form primitives ────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-soft">{label}</span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "min-w-[120px] rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-700",
        className,
      )}
    >
      {children}
    </select>
  );
}

function NumInput({
  value,
  onChange,
  placeholder,
}: {
  value: number | undefined;
  onChange: (v: string | undefined) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      defaultValue={value ?? ""}
      placeholder={placeholder}
      onBlur={(e) => onChange(e.currentTarget.value || undefined)}
      className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-muted-soft focus:border-brand-700"
    />
  );
}

function ViewBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md transition-colors",
        active ? "bg-brand-50 text-brand-700 shadow-sm" : "text-muted hover:text-ink-soft",
      )}
    >
      {children}
    </button>
  );
}
