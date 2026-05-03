import type { Listing, ListingType, DealKind } from "@/types";
import { LOCATIONS } from "./locations";
import { AGENCIES } from "./agencies";

const IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&h=600&fit=crop",
];

const FEATURES_POOL = [
  "sea view", "balcony", "parking", "elevator", "terrace", "pool", "garden",
  "furnished", "air conditioning", "fireplace", "garage", "storage", "new build",
];

const TITLES: Record<ListingType, { en: (c: string) => string; me: (c: string) => string; ru: (c: string) => string }> = {
  apartment:  { en: (c) => `Modern apartment in ${c}`,         me: (c) => `Savremen stan u ${c}`,         ru: (c) => `Современная квартира в ${c}` },
  house:      { en: (c) => `Charming house in ${c}`,           me: (c) => `Udobna kuća u ${c}`,            ru: (c) => `Уютный дом в ${c}` },
  land:       { en: (c) => `Building plot in ${c}`,            me: (c) => `Plac za gradnju u ${c}`,        ru: (c) => `Участок под застройку в ${c}` },
  commercial: { en: (c) => `Commercial space in ${c}`,         me: (c) => `Poslovni prostor u ${c}`,       ru: (c) => `Коммерческое помещение в ${c}` },
};

const DESCRIPTIONS: Record<ListingType, { en: string; me: string; ru: string }> = {
  apartment: {
    en: "A bright and well-laid-out apartment with thoughtful finishes, ideal for living year-round or as a holiday rental.",
    me: "Svijetao i funkcionalno raspoređen stan sa kvalitetnim završnim radovima, idealan za stalan život ili izdavanje.",
    ru: "Светлая и продуманно спланированная квартира с качественной отделкой, подойдёт и для жизни, и для аренды.",
  },
  house: {
    en: "A welcoming family home set in a quiet area, with private outdoor space and easy access to amenities.",
    me: "Topla porodična kuća u mirnom dijelu, sa privatnim spoljnim prostorom i blizu svih sadržaja.",
    ru: "Уютный семейный дом в тихом районе, с собственной территорией и удобным доступом к инфраструктуре.",
  },
  land: {
    en: "A clean building plot with road access, ready for residential development. Suitable for villa or small project.",
    me: "Uređen plac sa pristupnim putem, spreman za stambenu gradnju. Pogodan za vilu ili manji projekat.",
    ru: "Подготовленный участок с подъездной дорогой, готов под жилую застройку. Подходит для виллы или небольшого проекта.",
  },
  commercial: {
    en: "Versatile commercial unit suitable for retail, office or hospitality use, in a high-foot-traffic location.",
    me: "Univerzalni poslovni prostor pogodan za maloprodaju, kancelariju ili ugostiteljstvo, na lokaciji sa velikim protokom ljudi.",
    ru: "Универсальное коммерческое помещение под ритейл, офис или общепит — в локации с хорошим пешеходным трафиком.",
  },
};

// Seeded RNG so listings are stable across renders/builds
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generate(): Listing[] {
  const rng = makeRng(42);
  const out: Listing[] = [];
  const TYPES: ListingType[] = ["apartment", "house", "land", "commercial"];
  const DEALS: DealKind[] = ["sale", "rent"];

  for (let i = 1; i <= 60; i++) {
    const type = TYPES[i % TYPES.length];
    const deal: DealKind = i % 3 === 0 ? DEALS[1] : DEALS[0];
    const loc = LOCATIONS[i % LOCATIONS.length];
    const agency = AGENCIES[i % AGENCIES.length];
    const beds  = type === "land" || type === "commercial" ? 0 : Math.ceil(rng() * 4);
    const baths = type === "land" ? 0 : type === "commercial" ? Math.ceil(rng() * 2) : Math.ceil(rng() * 3);
    const area  = type === "land" ? 200 + Math.floor(rng() * 2000) : 30 + Math.floor(rng() * 250);

    const basePrice =
      type === "land"       ? area * (40 + rng() * 60) :
      type === "house"      ? area * (1500 + rng() * 2500) :
      type === "commercial" ? area * (1200 + rng() * 1800) :
                              area * (1800 + rng() * 2200);

    const price = deal === "rent"
      ? Math.round(basePrice / 200 / 50) * 50
      : Math.round(basePrice / 1000) * 1000;

    // Pick 2-4 random features
    const featureCount = 2 + Math.floor(rng() * 3);
    const features: string[] = [];
    while (features.length < featureCount) {
      const f = FEATURES_POOL[Math.floor(rng() * FEATURES_POOL.length)];
      if (!features.includes(f)) features.push(f);
    }

    const ownerKind = rng() < 0.2 ? "private" : "agency";
    const image = IMAGES[(i - 1) % IMAGES.length];

    out.push({
      id: String(i),
      ownerKind,
      agencyId: ownerKind === "agency" ? agency.id : null,
      ownerName: ownerKind === "private" ? "Private seller" : undefined,
      type,
      deal,
      status: "active",
      title: {
        en: TITLES[type].en(loc.name),
        me: TITLES[type].me(loc.name),
        ru: TITLES[type].ru(loc.name),
      },
      description: DESCRIPTIONS[type],
      price,
      area,
      beds,
      baths,
      yearBuilt: type === "land" ? undefined : 1980 + Math.floor(rng() * 45),
      features,
      location: {
        city: loc.name,
        lat: loc.lat + (rng() - 0.5) * 0.03,
        lng: loc.lng + (rng() - 0.5) * 0.03,
      },
      image,
      images: [image, IMAGES[(i + 1) % IMAGES.length], IMAGES[(i + 3) % IMAGES.length]],
      featured: i <= 6,
      createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
    });
  }
  return out;
}

export const LISTINGS: Listing[] = generate();
