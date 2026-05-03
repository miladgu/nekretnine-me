# Nekretnine.me

A real-estate marketplace for Montenegro, with two differentiators:

- An **interactive map** built on MapLibre GL that overlays the public WMS layers from [Geoportal Crne Gore](https://geoportal.co.me/) (orthophoto + topographic) on top of the listings.
- An **AI matching layer** (planned) that ranks listings against a buyer's intent profile instead of forcing them to scroll endless filter results.

The site is trilingual (English / Crnogorski / Русский), supports both private sellers and agencies, and is built as a public marketplace first — AI matching is one feature, not a gate.

> **Status: early prototype.** Phases 0–2 are built and runnable. Auth, real persistence, and the AI matching engine are in the plan but not yet wired (see [Roadmap](#roadmap)).

---

## What's built so far

| Area | What works | Phase |
|---|---|---|
| Design system | Tailwind v4 theme tokens lifted from the original visual prototype, Inter font, custom popup skin for MapLibre | 0 |
| Routing | App Router, 15 routes, lang-switcher (EN / ME / RU), favorites + compare in `localStorage` | 0–1 |
| Public screens | Home (hero + featured + agencies CTA), Listings (filters, sort, grid/list, URL-driven state), Listing detail (gallery, stats, agency box, related), Agencies index, Agency profile, Favorites, Compare | 1 |
| Map | Fullscreen MapLibre map with three basemaps (OSM Streets, Geoportal CG Ortofoto WMS, Geoportal CG TK25 topo WMS), 60 listings as colored pins (sale=teal, rent=purple), click → popup with image/price/link, side list, layer switcher with a deliberately-disabled **Cadastre** slot | 2 |

Stub pages exist for the rest (sign in/up, account, post a listing, AI matching, messages) — they show what phase will fill them in.

## Roadmap

| Phase | What | Needs |
|---|---|---|
| 3 | Supabase wiring — Postgres schema, auth, RLS, image uploads. Swap the in-memory mock data layer for real queries. | A Supabase project (free tier is fine) |
| 4 | AI matching — Claude extracts structured preferences from a buyer's free-text wishes, embeds the profile, embeds each listing, ranks by hard filters + cosine similarity, generates a 1-line "why this matches you" per result. | Anthropic API key |
| 5 | Inquiries / messaging between buyers and agencies | Phase 3 done first |

The cadastre layer (parcel polygons, parcel-number lookup) is **architected but empty** — the WMS endpoint at Geoportal CG is HTTP-Basic-auth gated. Adding it later is a config change in [`src/lib/map/sources.ts`](src/lib/map/sources.ts) plus one more entry in the layer switcher.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** + **Tailwind CSS v4**
- **MapLibre GL JS** for the map
- **lucide-react** for icons
- **`@anthropic-ai/sdk`** and **`@supabase/supabase-js`** are installed but not yet wired

## Run it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

No environment variables are needed for the current build (everything runs against in-memory mock data). When Phase 3 / 4 land, copy `.env.example` to `.env.local` and fill in.

## Project layout

```
src/
  app/                  # Next.js App Router routes — one folder per page
  components/           # Reusable UI (Nav, Footer, ListingCard, MapView, …)
  data/                 # Seeded mock data: listings, agencies, locations
                        #   — query API mirrors the Supabase shape so swapping
                        #     in Phase 3 is mechanical
  lib/
    i18n/               # Trilingual dictionaries + React provider
    map/sources.ts      # WMS endpoints (OSM, Geoportal CG ortofoto, topo)
    store/saved.tsx     # Favorites + compare list (localStorage-backed)
    utils.ts            # cn(), formatPrice()
  types/                # Domain types: Listing, Agency, BuyerProfile, …
public/                 # Static assets
_legacy/                # Original single-file vanilla-JS prototype (kept for
                        #   design reference only — not used by the app)
```

## Data sources & attribution

- **OpenStreetMap** for the streets basemap. © OpenStreetMap contributors. [Copyright notice](https://www.openstreetmap.org/copyright).
- **Geoportal Crne Gore (Uprava za nekretnine)** for the Ortofoto (DOF2018) and TK25 topo WMS layers. These endpoints respond with `Access-Control-Allow-Origin: *` and are used directly from the browser without a proxy. There is no published terms-of-use document; for commercial use you should contact Uprava za nekretnine.
- **Listing photos** are placeholder images from Unsplash, served via their CDN. Real listings would use Supabase Storage in Phase 3.
- All listings, agencies, and locations in the current build are **synthetic mock data** seeded from a deterministic RNG.

## License

[MIT](LICENSE) — see the file for full text.
