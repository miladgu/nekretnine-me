import type { DealKind, Listing, ListingType } from "@/types";
import { LISTINGS } from "./listings";
import { AGENCIES } from "./agencies";

/**
 * Mock query layer. Each function mirrors what the equivalent Supabase query
 * will return, so swapping the data source in Phase 3 is mechanical.
 */

export interface ListingFilters {
  search?: string;
  type?: ListingType | "all";
  deal?: DealKind | "all";
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  minBeds?: number;
  agencyId?: string;
}

export type ListingSort = "newest" | "price-asc" | "price-desc" | "area-desc";

export function listListings(filters: ListingFilters = {}, sort: ListingSort = "newest"): Listing[] {
  const search = filters.search?.trim().toLowerCase();

  const out = LISTINGS.filter((l) => {
    if (l.status !== "active") return false;
    if (search) {
      const hay = `${l.location.city} ${l.title.en} ${l.title.me} ${l.title.ru}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    if (filters.type && filters.type !== "all" && l.type !== filters.type) return false;
    if (filters.deal && filters.deal !== "all" && l.deal !== filters.deal) return false;
    if (filters.city && l.location.city !== filters.city) return false;
    if (filters.minPrice && l.price < filters.minPrice) return false;
    if (filters.maxPrice && l.price > filters.maxPrice) return false;
    if (filters.minArea && l.area < filters.minArea) return false;
    if (filters.maxArea && l.area > filters.maxArea) return false;
    if (filters.minBeds && l.beds < filters.minBeds) return false;
    if (filters.agencyId && l.agencyId !== filters.agencyId) return false;
    return true;
  });

  out.sort((a, b) => {
    switch (sort) {
      case "price-asc":  return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "area-desc":  return b.area - a.area;
      case "newest":
      default:           return b.createdAt.localeCompare(a.createdAt);
    }
  });

  return out;
}

export function getListing(id: string): Listing | undefined {
  return LISTINGS.find((l) => l.id === id);
}

export function listAgencies() {
  return AGENCIES;
}

export function getAgency(id: string) {
  return AGENCIES.find((a) => a.id === id);
}

export function getAgencyBySlug(slug: string) {
  return AGENCIES.find((a) => a.slug === slug);
}

export function getListingsByAgency(agencyId: string) {
  return listListings({ agencyId });
}

export function getFeaturedListings(limit = 6) {
  return LISTINGS.filter((l) => l.featured).slice(0, limit);
}
