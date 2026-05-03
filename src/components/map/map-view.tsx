"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import maplibregl, {
  type GeoJSONSource,
  type MapMouseEvent,
  type RasterTileSource,
} from "maplibre-gl";
import type { Listing } from "@/types";
import {
  BASEMAPS,
  MONTENEGRO_BOUNDS,
  MONTENEGRO_CENTER,
  type BasemapKey,
} from "@/lib/map/sources";
import { formatPrice } from "@/lib/utils";

const BASE_LAYER_ID = "nm-basemap";
const BASE_SOURCE_ID = "nm-basemap-source";
const PIN_SOURCE_ID = "nm-pins-source";
const PIN_LAYER_ID = "nm-pins-layer";
const PIN_SELECTED_LAYER_ID = "nm-pins-selected-layer";

export interface MapViewProps {
  listings: Listing[];
  basemap: BasemapKey;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  locale: "en" | "me" | "ru";
}

/**
 * MapLibre wrapper. Owns the map instance for the component's lifetime.
 * Re-renders only swap the basemap source or refresh the pins data — never
 * destroy and rebuild the map.
 */
export function MapView({ listings, basemap, selectedId, onSelect, locale }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  // Keep the latest values around for callbacks set up only once
  const listingsRef = useRef(listings);
  const localeRef = useRef(locale);
  const onSelectRef = useRef(onSelect);
  useEffect(() => { listingsRef.current = listings; }, [listings]);
  useEffect(() => { localeRef.current = locale; }, [locale]);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  // Bootstrap the map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      center: MONTENEGRO_CENTER,
      zoom: 7.4,
      maxBounds: [
        [MONTENEGRO_BOUNDS[0] - 1, MONTENEGRO_BOUNDS[1] - 1],
        [MONTENEGRO_BOUNDS[2] + 1, MONTENEGRO_BOUNDS[3] + 1],
      ],
      style: {
        version: 8,
        sources: { [BASE_SOURCE_ID]: BASEMAPS[basemap].source },
        layers: [{ id: BASE_LAYER_ID, type: "raster", source: BASE_SOURCE_ID }],
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      },
      attributionControl: { compact: true },
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

    map.on("load", () => {
      // GeoJSON pins source
      map.addSource(PIN_SOURCE_ID, {
        type: "geojson",
        data: toFeatureCollection(listingsRef.current),
      });

      // Base pin layer
      map.addLayer({
        id: PIN_LAYER_ID,
        type: "circle",
        source: PIN_SOURCE_ID,
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 7, 5, 12, 9, 16, 14],
          "circle-color": [
            "match",
            ["get", "deal"],
            "rent", "#7c3aed",
            "#0e7490",
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.95,
        },
      });

      // Selected pin layer (rendered on top)
      map.addLayer({
        id: PIN_SELECTED_LAYER_ID,
        type: "circle",
        source: PIN_SOURCE_ID,
        filter: ["==", ["get", "id"], "__none__"],
        paint: {
          "circle-radius": 12,
          "circle-color": [
            "match",
            ["get", "deal"],
            "rent", "#7c3aed",
            "#0e7490",
          ],
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Click handler — open popup, fire onSelect
      const handleClick = (e: MapMouseEvent) => {
        const features = map.queryRenderedFeatures(e.point, { layers: [PIN_LAYER_ID] });
        if (features.length === 0) {
          onSelectRef.current?.(null);
          return;
        }
        const feature = features[0];
        const props = feature.properties as Record<string, string>;
        const id = props.id;
        const listing = listingsRef.current.find((l) => l.id === id);
        if (!listing) return;

        openPopup(map, popupRef, listing, localeRef.current);
        onSelectRef.current?.(id);
      };

      map.on("click", handleClick);
      map.on("mouseenter", PIN_LAYER_ID, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", PIN_LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
      });
    });

    mapRef.current = map;
    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update basemap tiles when basemap prop changes (preserves source identity)
  const lastBasemapRef = useRef(basemap);
  useEffect(() => {
    if (lastBasemapRef.current === basemap) return;
    lastBasemapRef.current = basemap;
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const src = map.getSource(BASE_SOURCE_ID) as RasterTileSource | undefined;
      const tiles = BASEMAPS[basemap].source.tiles;
      if (src && tiles) src.setTiles([...tiles]);
    };
    if (map.isStyleLoaded()) apply();
    else map.once("idle", apply);
  }, [basemap]);

  // Update pins data when listings change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const src = map.getSource(PIN_SOURCE_ID) as GeoJSONSource | undefined;
      if (!src) return;
      src.setData(toFeatureCollection(listings));
    };
    if (map.isStyleLoaded() && map.getSource(PIN_SOURCE_ID)) apply();
    else map.once("idle", apply);
  }, [listings]);

  // Highlight selected pin
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      if (!map.getLayer(PIN_SELECTED_LAYER_ID)) return;
      map.setFilter(PIN_SELECTED_LAYER_ID, ["==", ["get", "id"], selectedId ?? "__none__"]);
    };
    if (map.isStyleLoaded()) apply();
    else map.once("idle", apply);
  }, [selectedId]);

  return <div ref={containerRef} className="size-full" />;
}

// ── helpers ─────────────────────────────────────────────────────────────────

function toFeatureCollection(listings: Listing[]) {
  return {
    type: "FeatureCollection" as const,
    features: listings.map((l) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [l.location.lng, l.location.lat] },
      properties: {
        id: l.id,
        deal: l.deal,
        type: l.type,
        price: l.price,
        city: l.location.city,
      },
    })),
  };
}

function openPopup(
  map: maplibregl.Map,
  popupRef: React.MutableRefObject<maplibregl.Popup | null>,
  listing: Listing,
  locale: "en" | "me" | "ru",
) {
  popupRef.current?.remove();
  const html = `
    <a href="/listings/${listing.id}" style="text-decoration:none;color:inherit;display:block;width:240px;">
      <div style="position:relative;width:100%;aspect-ratio:4/3;background:#f1f5f9;overflow:hidden;border-radius:8px 8px 0 0;">
        <img src="${escapeHtml(listing.image)}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
        <span style="position:absolute;left:8px;top:8px;background:${
          listing.deal === "rent" ? "#7c3aed" : "#0e7490"
        };color:#fff;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;padding:3px 8px;border-radius:999px;">${listing.deal}</span>
      </div>
      <div style="padding:10px 12px 12px;">
        <div style="font-size:16px;font-weight:700;color:#0f172a;">${formatPrice(listing.price)}${
          listing.deal === "rent" ? '<span style="font-size:12px;font-weight:400;color:#64748b"> /mo</span>' : ""
        }</div>
        <div style="font-size:12px;color:#475569;margin-top:2px;">${escapeHtml(listing.title[locale])}</div>
        <div style="font-size:11px;color:#64748b;margin-top:4px;">${escapeHtml(listing.location.city)}</div>
      </div>
    </a>
  `;
  popupRef.current = new maplibregl.Popup({
    offset: 12,
    closeButton: false,
    maxWidth: "260px",
    className: "nm-popup",
  })
    .setLngLat([listing.location.lng, listing.location.lat])
    .setHTML(html)
    .addTo(map);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
