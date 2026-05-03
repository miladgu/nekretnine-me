"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const FAV_KEY = "nm-favorites";
const COMP_KEY = "nm-compare";
const COMPARE_LIMIT = 4;

type Ctx = {
  favorites: string[];
  compare: string[];
  isFav: (id: string) => boolean;
  isComp: (id: string) => boolean;
  toggleFav: (id: string) => void;
  toggleComp: (id: string) => boolean; // returns true if accepted, false if rejected (limit hit)
  clearFavs: () => void;
  clearComp: () => void;
  hydrated: boolean;
};

const SavedContext = createContext<Ctx | null>(null);

function readArray(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(readArray(FAV_KEY));
    setCompare(readArray(COMP_KEY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(FAV_KEY, JSON.stringify(favorites)); } catch {}
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(COMP_KEY, JSON.stringify(compare)); } catch {}
  }, [compare, hydrated]);

  const toggleFav = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const toggleComp = useCallback((id: string) => {
    let accepted = true;
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= COMPARE_LIMIT) {
        accepted = false;
        return prev;
      }
      return [...prev, id];
    });
    return accepted;
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      favorites,
      compare,
      isFav: (id) => favorites.includes(id),
      isComp: (id) => compare.includes(id),
      toggleFav,
      toggleComp,
      clearFavs: () => setFavorites([]),
      clearComp: () => setCompare([]),
      hydrated,
    }),
    [favorites, compare, toggleFav, toggleComp, hydrated],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used inside <SavedProvider>");
  return ctx;
}

export const COMPARE_MAX = COMPARE_LIMIT;
