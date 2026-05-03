export type Locale = "en" | "me" | "ru";
export const LOCALES: Locale[] = ["en", "me", "ru"];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  me: "ME",
  ru: "RU",
};

const en = {
    brand: "Nekretnine.me",
    tagline: "Find your perfect property in Montenegro",
    heroTitle: "Discover Montenegro real estate",
    heroSub: "Search across 50+ agencies. Buy, rent, or invest in the Adriatic's hidden gem.",

    // Nav
    nav: {
      home: "Home",
      listings: "Listings",
      map: "Map",
      agencies: "Agencies",
      matching: "AI matching",
      favorites: "Favorites",
      compare: "Compare",
      post: "Post a listing",
      signin: "Sign in",
      signup: "Sign up",
      account: "My account",
    },

    // Sections
    section: {
      featured: "Featured properties",
      topAgencies: "Top agencies",
      viewAll: "View all",
      newest: "Newest",
      forSale: "For sale",
      forRent: "For rent",
    },

    // Listing fields
    listing: {
      type: "Type",
      deal: "Deal",
      sale: "Sale",
      rent: "Rent",
      apartment: "Apartment",
      house: "House",
      land: "Land",
      commercial: "Commercial",
      beds: "beds",
      baths: "baths",
      sqm: "m²",
      perMonth: "/mo",
      pricePerSqm: "Price per m²",
      area: "Area",
      location: "Location",
      agency: "Agency",
      description: "Description",
      features: "Features",
    },

    // Filters
    filter: {
      all: "All",
      filters: "Filters",
      apply: "Apply",
      reset: "Reset",
      clear: "Clear all",
      minPrice: "Min price",
      maxPrice: "Max price",
      minArea: "Min m²",
      maxArea: "Max m²",
      bedrooms: "Bedrooms",
      anyBeds: "Any",
      results: "results",
      noResults: "No properties match your filters",
    },

    // Common
    common: {
      search: "Search location, neighbourhood…",
      view: "View",
      grid: "Grid",
      list: "List",
      back: "Back",
      save: "Save",
      saved: "Saved",
      addToCompare: "Add to compare",
      inCompare: "In compare",
      contactAgency: "Contact agency",
      viewDetails: "View details",
      phone: "Phone",
      email: "Email",
      website: "Website",
      about: "About",
      cancel: "Cancel",
      close: "Close",
      send: "Send",
      loading: "Loading…",
    },

    // CTAs
    cta: {
      heroSearch: "Search properties",
      forAgencies: "Are you an agency? Connect with us",
      tryMatching: "Find your perfect match with AI",
      tryMatchingSub: "Tell us what you're looking for. We'll surface listings that actually fit.",
      startMatching: "Start AI matching",
    },

    // AI matching
    matching: {
      title: "AI property matching",
      sub: "Tell us what matters. We rank what's available against your real preferences.",
      step1: "Tell us about your search",
      step2: "Add your must-haves",
      step3: "See your matches",
      freeText: "What are you looking for?",
      freeTextPlaceholder: "e.g. quiet street near the old town, sea view nice-to-have, walking distance to a school",
      generateMatches: "Find matches",
      whyMatch: "Why this matches you",
      matchScore: "Match",
    },

    // Map
    map: {
      title: "Interactive map",
      sub: "Browse listings, ortofoto and topographic layers across Montenegro.",
      layers: "Layers",
      basemap: "Basemap",
      streets: "Streets",
      ortofoto: "Ortofoto",
      topo: "Topo (TK25)",
      cadastre: "Cadastre",
      cadastreUnavailable: "Cadastre data is not yet available — pending agreement with Uprava za nekretnine.",
      legend: "Legend",
    },

    // Footer
  footer: {
    brand: "Nekretnine.me",
    tagline: "Montenegro's real estate marketplace — connecting buyers with trusted agencies.",
    legal: "© 2026 Nekretnine.me — All rights reserved",
    forBuyers: "For buyers",
    forSellers: "For sellers",
    company: "Company",
    contact: "Contact",
  },
};

export type Dict = typeof en;
export const dictionaries = { en };
