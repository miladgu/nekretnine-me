/**
 * Map base layers and overlay sources.
 *
 * Public WMS endpoints exposed by Geoportal CG (Uprava za nekretnine) — confirmed
 * to send `Access-Control-Allow-Origin: *`, so we can hit them directly from the
 * browser. See [project_geoportal_strategy.md] for context.
 *
 * Cadastre is intentionally left as a `disabled` entry so the layer switcher can
 * surface the slot to the user without rendering anything.
 */

import type { RasterSourceSpecification } from "maplibre-gl";

export type BasemapKey = "streets" | "ortofoto" | "topo";

export interface BasemapDef {
  key: BasemapKey;
  source: RasterSourceSpecification;
}

export const BASEMAPS: Record<BasemapKey, BasemapDef> = {
  streets: {
    key: "streets",
    source: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxzoom: 19,
    },
  },
  ortofoto: {
    key: "ortofoto",
    source: {
      type: "raster",
      tiles: [
        "https://geoportalcg.me/erdas-iws/ogc/wms/Ortofoto" +
          "?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap" +
          "&LAYERS=Ortofoto_DOF2018&STYLES=" +
          "&FORMAT=image/jpeg&CRS=EPSG:3857" +
          "&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}",
      ],
      tileSize: 256,
      attribution: "© Geoportal CG / Uprava za nekretnine",
      maxzoom: 19,
    },
  },
  topo: {
    key: "topo",
    source: {
      type: "raster",
      tiles: [
        "https://geoportalcg.me/erdas-iws/ogc/wms/TK25" +
          "?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap" +
          "&LAYERS=TK25_Mozaik&STYLES=" +
          "&FORMAT=image/png&CRS=EPSG:3857" +
          "&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}",
      ],
      tileSize: 256,
      attribution: "© Geoportal CG / Uprava za nekretnine",
      maxzoom: 19,
    },
  },
};

export const MONTENEGRO_CENTER: [number, number] = [19.0, 42.7];
export const MONTENEGRO_BOUNDS: [number, number, number, number] = [18.3, 41.85, 20.4, 43.6];
