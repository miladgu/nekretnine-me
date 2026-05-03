import { useState, useMemo, useCallback, useEffect } from "react";
import * as d3 from "d3";

// ─── i18n ────────────────────────────────────────────────────────────────────
const T = {
  en: {
    brand: "Nekretnine.me",
    tagline: "Find your perfect property in Montenegro",
    search: "Search location…",
    filters: "Filters",
    type: "Type",
    all: "All",
    apartment: "Apartment",
    house: "House",
    land: "Land",
    commercial: "Commercial",
    deal: "Deal",
    sale: "Sale",
    rent: "Rent",
    priceRange: "Price range",
    minPrice: "Min price",
    maxPrice: "Max price",
    areaRange: "Area (m²)",
    minArea: "Min m²",
    maxArea: "Max m²",
    bedrooms: "Bedrooms",
    anyBeds: "Any",
    apply: "Apply",
    reset: "Reset",
    results: "results",
    map: "Map",
    list: "List",
    grid: "Grid",
    agencies: "Agencies",
    favorites: "Favorites",
    compare: "Compare",
    home: "Home",
    beds: "beds",
    baths: "baths",
    sqm: "m²",
    perMonth: "/mo",
    addFav: "Save",
    removeFav: "Saved",
    addCompare: "Compare",
    removeCompare: "In compare",
    viewDetails: "View details",
    contactAgency: "Contact agency",
    listingsCount: "listings",
    phone: "Phone",
    email: "Email",
    website: "Website",
    aboutAgency: "About",
    back: "← Back",
    clearAll: "Clear all",
    noResults: "No properties match your filters",
    noFavorites: "No saved properties yet",
    noCompare: "Add properties to compare",
    compareProp: "Compare properties",
    property: "Property",
    price: "Price",
    area: "Area",
    location: "Location",
    agency: "Agency",
    lang: "EN",
    connectCTA: "Are you an agency? Connect with us",
    heroTitle: "Discover Montenegro Real Estate",
    heroSub: "Search across 50+ agencies. Buy, rent, or invest in the Adriatic's hidden gem.",
    featured: "Featured properties",
    topAgencies: "Top agencies",
    viewAll: "View all →",
    close: "Close",
  },
  me: {
    brand: "Nekretnine.me",
    tagline: "Pronađite savršenu nekretninu u Crnoj Gori",
    search: "Pretraži lokaciju…",
    filters: "Filteri",
    type: "Tip",
    all: "Sve",
    apartment: "Stan",
    house: "Kuća",
    land: "Zemljište",
    commercial: "Poslovni prostor",
    deal: "Ponuda",
    sale: "Prodaja",
    rent: "Izdavanje",
    priceRange: "Cijena",
    minPrice: "Min cijena",
    maxPrice: "Max cijena",
    areaRange: "Površina (m²)",
    minArea: "Min m²",
    maxArea: "Max m²",
    bedrooms: "Spavaće sobe",
    anyBeds: "Sve",
    apply: "Primijeni",
    reset: "Resetuj",
    results: "rezultata",
    map: "Mapa",
    list: "Lista",
    grid: "Mreža",
    agencies: "Agencije",
    favorites: "Omiljeno",
    compare: "Uporedi",
    home: "Početna",
    beds: "soba",
    baths: "kupatila",
    sqm: "m²",
    perMonth: "/mj",
    addFav: "Sačuvaj",
    removeFav: "Sačuvano",
    addCompare: "Uporedi",
    removeCompare: "U poređenju",
    viewDetails: "Detalji",
    contactAgency: "Kontakt agenciju",
    listingsCount: "oglasa",
    phone: "Telefon",
    email: "Email",
    website: "Web stranica",
    aboutAgency: "O agenciji",
    back: "← Nazad",
    clearAll: "Obriši sve",
    noResults: "Nema nekretnina za zadate filtere",
    noFavorites: "Nemate sačuvanih nekretnina",
    noCompare: "Dodajte nekretnine za poređenje",
    compareProp: "Uporedi nekretnine",
    property: "Nekretnina",
    price: "Cijena",
    area: "Površina",
    location: "Lokacija",
    agency: "Agencija",
    lang: "ME",
    connectCTA: "Vi ste agencija? Povežite se s nama",
    heroTitle: "Otkrijte nekretnine u Crnoj Gori",
    heroSub: "Pretražite 50+ agencija. Kupite, iznajmite ili investirajte na Jadranu.",
    featured: "Istaknute nekretnine",
    topAgencies: "Top agencije",
    viewAll: "Pogledaj sve →",
    close: "Zatvori",
  },
  ru: {
    brand: "Nekretnine.me",
    tagline: "Найдите идеальную недвижимость в Черногории",
    search: "Поиск по локации…",
    filters: "Фильтры",
    type: "Тип",
    all: "Все",
    apartment: "Квартира",
    house: "Дом",
    land: "Участок",
    commercial: "Коммерческая",
    deal: "Сделка",
    sale: "Продажа",
    rent: "Аренда",
    priceRange: "Цена",
    minPrice: "Мин цена",
    maxPrice: "Макс цена",
    areaRange: "Площадь (м²)",
    minArea: "Мин м²",
    maxArea: "Макс м²",
    bedrooms: "Спальни",
    anyBeds: "Любые",
    apply: "Применить",
    reset: "Сбросить",
    results: "результатов",
    map: "Карта",
    list: "Список",
    grid: "Сетка",
    agencies: "Агентства",
    favorites: "Избранное",
    compare: "Сравнить",
    home: "Главная",
    beds: "спален",
    baths: "ванных",
    sqm: "м²",
    perMonth: "/мес",
    addFav: "Сохранить",
    removeFav: "Сохранено",
    addCompare: "Сравнить",
    removeCompare: "В сравнении",
    viewDetails: "Подробнее",
    contactAgency: "Связаться",
    listingsCount: "объявлений",
    phone: "Телефон",
    email: "Email",
    website: "Сайт",
    aboutAgency: "Об агентстве",
    back: "← Назад",
    clearAll: "Очистить",
    noResults: "Нет объектов по вашим фильтрам",
    noFavorites: "Нет сохранённых объектов",
    noCompare: "Добавьте объекты для сравнения",
    compareProp: "Сравнить объекты",
    property: "Объект",
    price: "Цена",
    area: "Площадь",
    location: "Локация",
    agency: "Агентство",
    lang: "RU",
    connectCTA: "Вы агентство? Свяжитесь с нами",
    heroTitle: "Откройте недвижимость Черногории",
    heroSub: "Поиск по 50+ агентствам. Покупка, аренда или инвестиции на Адриатике.",
    featured: "Рекомендуемые объекты",
    topAgencies: "Лучшие агентства",
    viewAll: "Показать все →",
    close: "Закрыть",
  },
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const AGENCIES = [
  { id: 1, name: "Adriatic Homes", logo: "🏠", color: "#0e7490", listings: 48, phone: "+382 67 123 456", email: "info@adriatichomes.me", website: "adriatichomes.me", desc: { en: "Premium coastal properties in Budva, Kotor and Tivat. Serving international clients since 2010.", me: "Premium primorske nekretnine u Budvi, Kotoru i Tivtu. Međunarodni klijenti od 2010.", ru: "Премиальная прибрежная недвижимость в Будве, Которе и Тивате. Работаем с 2010 года." } },
  { id: 2, name: "Montenegro Invest", logo: "📈", color: "#7c3aed", listings: 35, phone: "+382 69 234 567", email: "contact@mne-invest.com", website: "mne-invest.com", desc: { en: "Investment-grade properties and development projects across Montenegro.", me: "Investicione nekretnine i razvojni projekti širom Crne Gore.", ru: "Инвестиционная недвижимость и девелоперские проекты по всей Черногории." } },
  { id: 3, name: "Boka Bay Realty", logo: "⛵", color: "#0369a1", listings: 29, phone: "+382 68 345 678", email: "hello@bokabay.me", website: "bokabay.me", desc: { en: "Specialists in Boka Bay waterfront living — from historic stone houses to modern marina apartments.", me: "Specijalisti za život na obali Boke Kotorske — od kamenih kuća do modernih marina stanova.", ru: "Специалисты по недвижимости на берегу Боко-Которского залива." } },
  { id: 4, name: "Capital Estate", logo: "🏛️", color: "#b45309", listings: 22, phone: "+382 20 456 789", email: "info@capitalestate.me", website: "capitalestate.me", desc: { en: "Podgorica's leading agency for residential and commercial real estate.", me: "Vodeća agencija u Podgorici za stambene i poslovne nekretnine.", ru: "Ведущее агентство Подгорицы по жилой и коммерческой недвижимости." } },
  { id: 5, name: "Lustica Villas", logo: "🌿", color: "#15803d", listings: 18, phone: "+382 67 567 890", email: "villas@lustica.me", website: "lustica.me", desc: { en: "Exclusive villa developments on the Luštica peninsula with sea views.", me: "Ekskluzivne vile na poluostrvu Luštica sa pogledom na more.", ru: "Эксклюзивные виллы на полуострове Лушица с видом на море." } },
];

const LOCATIONS = [
  { name: "Budva", lat: 42.2914, lng: 18.8400 },
  { name: "Kotor", lat: 42.4247, lng: 18.7712 },
  { name: "Tivat", lat: 42.4319, lng: 18.6968 },
  { name: "Podgorica", lat: 42.4304, lng: 19.2594 },
  { name: "Herceg Novi", lat: 42.4531, lng: 18.5375 },
  { name: "Bar", lat: 42.0931, lng: 19.1003 },
  { name: "Ulcinj", lat: 41.9297, lng: 19.2064 },
  { name: "Cetinje", lat: 42.3931, lng: 18.9236 },
  { name: "Nikšić", lat: 42.7731, lng: 18.9444 },
  { name: "Luštica", lat: 42.3878, lng: 18.6756 },
];

const IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop",
];

function generateListings() {
  const types = ["apartment", "house", "land", "commercial"];
  const deals = ["sale", "rent"];
  const listings = [];
  for (let i = 1; i <= 60; i++) {
    const type = types[i % 4];
    const deal = deals[i % 3 === 0 ? 1 : 0];
    const loc = LOCATIONS[i % LOCATIONS.length];
    const agency = AGENCIES[i % AGENCIES.length];
    const beds = type === "land" ? 0 : type === "commercial" ? 0 : Math.ceil(Math.random() * 4);
    const baths = type === "land" ? 0 : type === "commercial" ? Math.ceil(Math.random() * 2) : Math.ceil(Math.random() * 3);
    const area = type === "land" ? 200 + Math.floor(Math.random() * 2000) : 30 + Math.floor(Math.random() * 250);
    const basePrice = type === "land" ? area * (40 + Math.random() * 60) : type === "house" ? area * (1500 + Math.random() * 2500) : type === "commercial" ? area * (1200 + Math.random() * 1800) : area * (1800 + Math.random() * 2200);
    const price = deal === "rent" ? Math.round(basePrice / 200 / 50) * 50 : Math.round(basePrice / 1000) * 1000;
    const titles = {
      apartment: { en: `Modern apartment in ${loc.name}`, me: `Moderan stan u ${loc.name === "Podgorica" ? "Podgorici" : loc.name === "Budva" ? "Budvi" : loc.name}`, ru: `Современная квартира в ${loc.name === "Podgorica" ? "Подгорице" : loc.name}` },
      house: { en: `Charming house in ${loc.name}`, me: `Šarmantna kuća u ${loc.name === "Podgorica" ? "Podgorici" : loc.name}`, ru: `Очаровательный дом в ${loc.name}` },
      land: { en: `Building plot in ${loc.name}`, me: `Građevinsko zemljište u ${loc.name === "Podgorica" ? "Podgorici" : loc.name}`, ru: `Участок под застройку в ${loc.name}` },
      commercial: { en: `Commercial space in ${loc.name}`, me: `Poslovni prostor u ${loc.name === "Podgorica" ? "Podgorici" : loc.name}`, ru: `Коммерческое помещение в ${loc.name}` },
    };
    listings.push({
      id: i,
      type,
      deal,
      title: titles[type],
      location: loc.name,
      lat: loc.lat + (Math.random() - 0.5) * 0.03,
      lng: loc.lng + (Math.random() - 0.5) * 0.03,
      price,
      area,
      beds,
      baths,
      agencyId: agency.id,
      image: IMAGES[(i - 1) % IMAGES.length],
      featured: i <= 6,
    });
  }
  return listings;
}

const ALL_LISTINGS = generateListings();

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1000000 ? `€${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `€${(n / 1000).toFixed(0)}K` : `€${n}`;

// ─── Components ──────────────────────────────────────────────────────────────

// ICON COMPONENTS
const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
);
const ScaleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
);
const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
);
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

// ─── MAP COMPONENT (SVG-based) ────────────────────────────────────────────────
function MontenegroMap({ listings, onSelect, selectedId }) {
  const width = 600, height = 500;
  const projection = d3.geoMercator()
    .center([19.0, 42.5])
    .scale(12000)
    .translate([width / 2, height / 2]);

  return (
    <div style={{ width: "100%", background: "#f0f7ff", borderRadius: 12, overflow: "hidden", position: "relative" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
        {/* Water background */}
        <rect width={width} height={height} fill="#dbeafe" />
        {/* Simple coastline hint */}
        <text x={80} y={height - 30} fill="#93c5fd" fontSize="14" fontFamily="system-ui" opacity={0.7}>Adriatic Sea</text>
        {/* Grid lines */}
        {[18, 18.5, 19, 19.5, 20].map(lng => {
          const [x] = projection([lng, 42.5]);
          return <line key={lng} x1={x} y1={0} x2={x} y2={height} stroke="#bfdbfe" strokeWidth={0.5} />;
        })}
        {[42, 42.25, 42.5, 42.75, 43].map(lat => {
          const [, y] = projection([19, lat]);
          return <line key={lat} x1={0} y1={y} x2={width} y2={y} stroke="#bfdbfe" strokeWidth={0.5} />;
        })}
        {/* City labels */}
        {LOCATIONS.map(loc => {
          const [x, y] = projection([loc.lng, loc.lat]);
          return (
            <g key={loc.name}>
              <circle cx={x} cy={y} r={3} fill="#64748b" opacity={0.3} />
              <text x={x + 6} y={y + 4} fill="#64748b" fontSize="10" fontFamily="system-ui">{loc.name}</text>
            </g>
          );
        })}
        {/* Property pins */}
        {listings.map(l => {
          const [x, y] = projection([l.lng, l.lat]);
          const isSelected = l.id === selectedId;
          const color = l.deal === "rent" ? "#7c3aed" : "#0e7490";
          return (
            <g key={l.id} onClick={() => onSelect(l.id)} style={{ cursor: "pointer" }}>
              <circle cx={x} cy={y} r={isSelected ? 10 : 6} fill={color} opacity={isSelected ? 1 : 0.8} stroke="#fff" strokeWidth={isSelected ? 2.5 : 1.5} />
              {isSelected && (
                <text x={x} y={y - 14} textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="600" fontFamily="system-ui">
                  {fmt(l.price)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(255,255,255,0.9)", borderRadius: 8, padding: "6px 12px", display: "flex", gap: 14, fontSize: 12, color: "#475569" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0e7490", display: "inline-block" }} /> Sale</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} /> Rent</span>
      </div>
    </div>
  );
}

// ─── PROPERTY CARD ────────────────────────────────────────────────────────────
function PropertyCard({ listing, t, lang, isFav, isComp, onToggleFav, onToggleComp, onSelect, compact }) {
  const agency = AGENCIES.find(a => a.id === listing.agencyId);
  return (
    <div
      onClick={() => onSelect(listing.id)}
      style={{
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s",
        border: "1px solid #e2e8f0",
        display: compact ? "flex" : "block",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{
        position: "relative",
        width: compact ? 200 : "100%",
        minWidth: compact ? 200 : undefined,
        height: compact ? "100%" : 200,
        minHeight: compact ? 140 : undefined,
        background: `url(${listing.image}) center/cover`,
      }}>
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          <span style={{
            background: listing.deal === "sale" ? "#0e7490" : "#7c3aed",
            color: "#fff",
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>{t[listing.deal]}</span>
          <span style={{
            background: "rgba(255,255,255,0.9)",
            color: "#334155",
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 500,
          }}>{t[listing.type]}</span>
        </div>
        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 4 }}>
          <button
            onClick={e => { e.stopPropagation(); onToggleFav(listing.id); }}
            style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          ><HeartIcon filled={isFav} /></button>
          <button
            onClick={e => { e.stopPropagation(); onToggleComp(listing.id); }}
            style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: isComp ? "#0e7490" : "rgba(255,255,255,0.9)", color: isComp ? "#fff" : "#334155", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          ><ScaleIcon /></button>
        </div>
      </div>
      <div style={{ padding: compact ? "14px 16px" : "14px 16px", flex: 1 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
          {fmt(listing.price)}{listing.deal === "rent" ? <span style={{ fontSize: 14, fontWeight: 400, color: "#64748b" }}>{t.perMonth}</span> : null}
        </div>
        <div style={{ fontSize: 13, color: "#475569", marginTop: 4, fontWeight: 500 }}>
          {listing.title[lang]}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, color: "#64748b", fontSize: 12 }}>
          <MapPinIcon /> {listing.location}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 10, color: "#64748b", fontSize: 12 }}>
          {listing.beds > 0 && <span>{listing.beds} {t.beds}</span>}
          {listing.baths > 0 && <span>{listing.baths} {t.baths}</span>}
          <span>{listing.area} {t.sqm}</span>
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8" }}>
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: agency?.color, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{agency?.logo}</span>
          {agency?.name}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function NekretnineMe() {
  const [lang, setLang] = useState("en");
  const t = T[lang];
  const [page, setPage] = useState("home"); // home | listings | agencies | favorites | compare | detail | agency
  const [viewMode, setViewMode] = useState("grid"); // grid | list | map
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [agencyId, setAgencyId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ type: "all", deal: "all", minPrice: "", maxPrice: "", minArea: "", maxArea: "", beds: "any" });

  const toggleFav = useCallback(id => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]), []);
  const toggleComp = useCallback(id => setCompareList(c => c.includes(id) ? c.filter(x => x !== id) : c.length < 4 ? [...c, id] : c), []);

  const filtered = useMemo(() => {
    return ALL_LISTINGS.filter(l => {
      if (searchText && !l.location.toLowerCase().includes(searchText.toLowerCase()) && !l.title.en.toLowerCase().includes(searchText.toLowerCase())) return false;
      if (filters.type !== "all" && l.type !== filters.type) return false;
      if (filters.deal !== "all" && l.deal !== filters.deal) return false;
      if (filters.minPrice && l.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && l.price > Number(filters.maxPrice)) return false;
      if (filters.minArea && l.area < Number(filters.minArea)) return false;
      if (filters.maxArea && l.area > Number(filters.maxArea)) return false;
      if (filters.beds !== "any" && l.beds < Number(filters.beds)) return false;
      return true;
    });
  }, [searchText, filters]);

  const selected = ALL_LISTINGS.find(l => l.id === selectedId);
  const selectedAgency = AGENCIES.find(a => a.id === agencyId);

  // ─── STYLES ──────────────────────────────────────────────────────────────
  const css = {
    app: { fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh", color: "#0f172a" },
    nav: { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 },
    navBrand: { fontSize: 22, fontWeight: 800, color: "#0e7490", letterSpacing: "-0.5px", cursor: "pointer" },
    navLinks: { display: "flex", gap: 6 },
    navLink: (active) => ({ padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", background: active ? "#f0f9ff" : "transparent", color: active ? "#0e7490" : "#64748b", border: "none", transition: "all 0.15s" }),
    langBtn: (active) => ({ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", background: active ? "#0e7490" : "#f1f5f9", color: active ? "#fff" : "#64748b", border: "none" }),
    container: { maxWidth: 1200, margin: "0 auto", padding: "0 24px" },
    hero: { background: "linear-gradient(135deg, #0e7490 0%, #0369a1 50%, #1e40af 100%)", color: "#fff", padding: "80px 24px", textAlign: "center" },
    heroTitle: { fontSize: 42, fontWeight: 800, letterSpacing: "-1px", marginBottom: 12 },
    heroSub: { fontSize: 17, opacity: 0.85, maxWidth: 560, margin: "0 auto 32px" },
    searchBar: { maxWidth: 600, margin: "0 auto", display: "flex", gap: 8, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 6 },
    searchInput: { flex: 1, padding: "12px 16px", borderRadius: 8, border: "none", fontSize: 15, outline: "none", background: "#fff", color: "#0f172a" },
    searchBtn: { padding: "12px 24px", borderRadius: 8, border: "none", background: "#0f172a", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 14 },
    section: { padding: "48px 0" },
    sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
    sectionTitle: { fontSize: 22, fontWeight: 700 },
    viewAllBtn: { fontSize: 13, color: "#0e7490", cursor: "pointer", fontWeight: 500, background: "none", border: "none" },
    grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 },
    agencyCard: { background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0", cursor: "pointer", transition: "all 0.2s" },
    badge: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 10, fontSize: 22 },
    filterPanel: { background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0", marginBottom: 20 },
    filterRow: { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" },
    filterGroup: { display: "flex", flexDirection: "column", gap: 4 },
    filterLabel: { fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" },
    select: { padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, color: "#334155", background: "#fff", outline: "none", minWidth: 110 },
    input: { padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, color: "#334155", background: "#fff", outline: "none", width: 100 },
    btn: (variant) => ({
      padding: "8px 18px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
      background: variant === "primary" ? "#0e7490" : variant === "ghost" ? "transparent" : "#f1f5f9",
      color: variant === "primary" ? "#fff" : "#475569",
    }),
    toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    resultCount: { fontSize: 14, color: "#64748b" },
    viewToggle: { display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 8, padding: 3 },
    viewBtn: (active) => ({ width: 32, height: 32, borderRadius: 6, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: active ? "#fff" : "transparent", color: active ? "#0e7490" : "#94a3b8", boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }),
    detailBack: { background: "none", border: "none", fontSize: 14, color: "#0e7490", cursor: "pointer", fontWeight: 500, marginBottom: 16, padding: 0 },
    detailImage: { width: "100%", height: 360, objectFit: "cover", borderRadius: 12 },
    detailGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginTop: 24 },
    detailStat: { background: "#f8fafc", borderRadius: 10, padding: "16px 20px", textAlign: "center" },
    detailStatVal: { fontSize: 22, fontWeight: 700, color: "#0f172a" },
    detailStatLabel: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
    agencyBox: { background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" },
    contactBtn: { width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "#0e7490", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 12 },
    compareTable: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden" },
    compareTh: { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" },
    compareTd: { padding: "12px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 14 },
    emptyState: { textAlign: "center", padding: "80px 20px", color: "#94a3b8" },
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
    modal: { background: "#fff", borderRadius: 16, padding: 32, maxWidth: 480, width: "90%", position: "relative" },
    footer: { borderTop: "1px solid #e2e8f0", padding: "32px 24px", textAlign: "center", color: "#94a3b8", fontSize: 13 },
  };

  // ─── RENDER PAGES ────────────────────────────────────────────────────────

  const renderHome = () => (
    <>
      <div style={css.hero}>
        <div style={css.heroTitle}>{t.heroTitle}</div>
        <div style={css.heroSub}>{t.heroSub}</div>
        <div style={css.searchBar}>
          <input
            style={css.searchInput}
            placeholder={t.search}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && setPage("listings")}
          />
          <button style={css.searchBtn} onClick={() => setPage("listings")}>
            <SearchIcon /> {t.filters}
          </button>
        </div>
      </div>
      <div style={css.container}>
        <div style={css.section}>
          <div style={css.sectionHeader}>
            <div style={css.sectionTitle}>{t.featured}</div>
            <button style={css.viewAllBtn} onClick={() => setPage("listings")}>{t.viewAll}</button>
          </div>
          <div style={css.grid3}>
            {ALL_LISTINGS.filter(l => l.featured).map(l => (
              <PropertyCard
                key={l.id} listing={l} t={t} lang={lang}
                isFav={favorites.includes(l.id)}
                isComp={compareList.includes(l.id)}
                onToggleFav={toggleFav}
                onToggleComp={toggleComp}
                onSelect={id => { setSelectedId(id); setPage("detail"); }}
              />
            ))}
          </div>
        </div>
        <div style={css.section}>
          <div style={css.sectionHeader}>
            <div style={css.sectionTitle}>{t.topAgencies}</div>
            <button style={css.viewAllBtn} onClick={() => setPage("agencies")}>{t.viewAll}</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {AGENCIES.map(a => (
              <div
                key={a.id}
                style={css.agencyCard}
                onClick={() => { setAgencyId(a.id); setPage("agency"); }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{ ...css.badge, background: a.color + "15", marginBottom: 12 }}>{a.logo}</div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{a.listings} {t.listingsCount}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #f0f9ff, #ede9fe)", borderRadius: 16, padding: "40px 32px", textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{t.connectCTA}</div>
          <button style={{ ...css.btn("primary"), padding: "12px 32px", fontSize: 15 }}>
            {t.contactAgency}
          </button>
        </div>
      </div>
    </>
  );

  const renderListings = () => (
    <div style={{ ...css.container, paddingTop: 24, paddingBottom: 48 }}>
      {/* Search bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <input
            style={{ ...css.searchInput, width: "100%", border: "1px solid #e2e8f0", paddingLeft: 40 }}
            placeholder={t.search}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}><SearchIcon /></span>
        </div>
        <button
          style={{ ...css.btn(showFilters ? "primary" : "default"), display: "flex", alignItems: "center", gap: 6 }}
          onClick={() => setShowFilters(!showFilters)}
        ><FilterIcon /> {t.filters}</button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div style={css.filterPanel}>
          <div style={css.filterRow}>
            <div style={css.filterGroup}>
              <div style={css.filterLabel}>{t.type}</div>
              <select style={css.select} value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
                <option value="all">{t.all}</option>
                <option value="apartment">{t.apartment}</option>
                <option value="house">{t.house}</option>
                <option value="land">{t.land}</option>
                <option value="commercial">{t.commercial}</option>
              </select>
            </div>
            <div style={css.filterGroup}>
              <div style={css.filterLabel}>{t.deal}</div>
              <select style={css.select} value={filters.deal} onChange={e => setFilters({ ...filters, deal: e.target.value })}>
                <option value="all">{t.all}</option>
                <option value="sale">{t.sale}</option>
                <option value="rent">{t.rent}</option>
              </select>
            </div>
            <div style={css.filterGroup}>
              <div style={css.filterLabel}>{t.minPrice}</div>
              <input style={css.input} type="number" placeholder="€" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
            </div>
            <div style={css.filterGroup}>
              <div style={css.filterLabel}>{t.maxPrice}</div>
              <input style={css.input} type="number" placeholder="€" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
            </div>
            <div style={css.filterGroup}>
              <div style={css.filterLabel}>{t.minArea}</div>
              <input style={css.input} type="number" placeholder="m²" value={filters.minArea} onChange={e => setFilters({ ...filters, minArea: e.target.value })} />
            </div>
            <div style={css.filterGroup}>
              <div style={css.filterLabel}>{t.maxArea}</div>
              <input style={css.input} type="number" placeholder="m²" value={filters.maxArea} onChange={e => setFilters({ ...filters, maxArea: e.target.value })} />
            </div>
            <div style={css.filterGroup}>
              <div style={css.filterLabel}>{t.bedrooms}</div>
              <select style={css.select} value={filters.beds} onChange={e => setFilters({ ...filters, beds: e.target.value })}>
                <option value="any">{t.anyBeds}</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <button style={css.btn("ghost")} onClick={() => setFilters({ type: "all", deal: "all", minPrice: "", maxPrice: "", minArea: "", maxArea: "", beds: "any" })}>
              {t.reset}
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={css.toolbar}>
        <div style={css.resultCount}><strong>{filtered.length}</strong> {t.results}</div>
        <div style={css.viewToggle}>
          <button style={css.viewBtn(viewMode === "grid")} onClick={() => setViewMode("grid")}><GridIcon /></button>
          <button style={css.viewBtn(viewMode === "list")} onClick={() => setViewMode("list")}><ListIcon /></button>
          <button style={css.viewBtn(viewMode === "map")} onClick={() => setViewMode("map")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "map" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <MontenegroMap listings={filtered} selectedId={selectedId} onSelect={id => setSelectedId(id)} />
          <div style={{ maxHeight: 500, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
            {(selectedId ? filtered.filter(l => l.id === selectedId) : filtered.slice(0, 10)).map(l => (
              <PropertyCard
                key={l.id} listing={l} t={t} lang={lang} compact
                isFav={favorites.includes(l.id)}
                isComp={compareList.includes(l.id)}
                onToggleFav={toggleFav}
                onToggleComp={toggleComp}
                onSelect={id => { setSelectedId(id); setPage("detail"); }}
              />
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={css.emptyState}>{t.noResults}</div>
      ) : (
        <div style={viewMode === "grid" ? css.grid3 : { display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(l => (
            <PropertyCard
              key={l.id} listing={l} t={t} lang={lang} compact={viewMode === "list"}
              isFav={favorites.includes(l.id)}
              isComp={compareList.includes(l.id)}
              onToggleFav={toggleFav}
              onToggleComp={toggleComp}
              onSelect={id => { setSelectedId(id); setPage("detail"); }}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderDetail = () => {
    if (!selected) return null;
    const agency = AGENCIES.find(a => a.id === selected.agencyId);
    return (
      <div style={{ ...css.container, paddingTop: 24, paddingBottom: 48 }}>
        <button style={css.detailBack} onClick={() => setPage("listings")}>{t.back}</button>
        <img src={selected.image} alt="" style={css.detailImage} />
        <div style={css.detailGrid}>
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <span style={{ background: selected.deal === "sale" ? "#ecfeff" : "#f5f3ff", color: selected.deal === "sale" ? "#0e7490" : "#7c3aed", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{t[selected.deal]}</span>
              <span style={{ background: "#f1f5f9", color: "#475569", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{t[selected.type]}</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.5px" }}>{selected.title[lang]}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#64748b", fontSize: 14, marginBottom: 20 }}>
              <MapPinIcon /> {selected.location}, Montenegro
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0e7490", marginBottom: 24 }}>
              {fmt(selected.price)}{selected.deal === "rent" ? <span style={{ fontSize: 16, fontWeight: 400, color: "#94a3b8" }}>{t.perMonth}</span> : null}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              {selected.beds > 0 && <div style={css.detailStat}><div style={css.detailStatVal}>{selected.beds}</div><div style={css.detailStatLabel}>{t.beds}</div></div>}
              {selected.baths > 0 && <div style={css.detailStat}><div style={css.detailStatVal}>{selected.baths}</div><div style={css.detailStatLabel}>{t.baths}</div></div>}
              <div style={css.detailStat}><div style={css.detailStatVal}>{selected.area}</div><div style={css.detailStatLabel}>{t.sqm}</div></div>
              <div style={css.detailStat}><div style={css.detailStatVal}>{selected.area > 0 ? `€${Math.round(selected.price / selected.area)}` : "—"}</div><div style={css.detailStatLabel}>€/{t.sqm}</div></div>
            </div>
            {/* Mini map */}
            <MontenegroMap listings={[selected]} selectedId={selected.id} onSelect={() => {}} />
          </div>
          <div>
            <div style={css.agencyBox}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ ...css.badge, background: agency?.color + "15", fontSize: 24 }}>{agency?.logo}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{agency?.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{agency?.listings} {t.listingsCount}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 16 }}>{agency?.desc[lang]}</div>
              <div style={{ fontSize: 13, color: "#475569", display: "flex", flexDirection: "column", gap: 6 }}>
                <div>{t.phone}: {agency?.phone}</div>
                <div>{t.email}: {agency?.email}</div>
              </div>
              <button style={css.contactBtn}>{t.contactAgency}</button>
              <button
                style={{ ...css.contactBtn, background: "#f1f5f9", color: "#334155", marginTop: 8 }}
                onClick={() => { setAgencyId(agency?.id); setPage("agency"); }}
              >
                {t.viewAll} {t.listingsCount}
              </button>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button
                style={{ ...css.btn(favorites.includes(selected.id) ? "primary" : "default"), flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                onClick={() => toggleFav(selected.id)}
              >
                <HeartIcon filled={favorites.includes(selected.id)} />
                {favorites.includes(selected.id) ? t.removeFav : t.addFav}
              </button>
              <button
                style={{ ...css.btn(compareList.includes(selected.id) ? "primary" : "default"), flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                onClick={() => toggleComp(selected.id)}
              >
                <ScaleIcon />
                {compareList.includes(selected.id) ? t.removeCompare : t.addCompare}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAgencies = () => (
    <div style={{ ...css.container, paddingTop: 24, paddingBottom: 48 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>{t.agencies}</h2>
      <div style={css.grid3}>
        {AGENCIES.map(a => (
          <div
            key={a.id}
            style={{ ...css.agencyCard, padding: 24 }}
            onClick={() => { setAgencyId(a.id); setPage("agency"); }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{ ...css.badge, background: a.color + "15", fontSize: 24 }}>{a.logo}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{a.listings} {t.listingsCount}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{a.desc[lang]}</div>
            <div style={{ marginTop: 14, fontSize: 12, color: "#64748b" }}>
              <div>{a.phone}</div>
              <div>{a.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAgencyPage = () => {
    if (!selectedAgency) return null;
    const agencyListings = ALL_LISTINGS.filter(l => l.agencyId === selectedAgency.id);
    return (
      <div style={{ ...css.container, paddingTop: 24, paddingBottom: 48 }}>
        <button style={css.detailBack} onClick={() => setPage("agencies")}>{t.back}</button>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ ...css.badge, background: selectedAgency.color + "15", fontSize: 32, width: 60, height: 60 }}>{selectedAgency.logo}</div>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{selectedAgency.name}</h2>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>{selectedAgency.listings} {t.listingsCount}</div>
          </div>
        </div>
        <div style={{ ...css.agencyBox, marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 8 }}>{t.aboutAgency}</h3>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 16px" }}>{selectedAgency.desc[lang]}</p>
          <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#475569" }}>
            <span>{t.phone}: {selectedAgency.phone}</span>
            <span>{t.email}: {selectedAgency.email}</span>
            <span>{t.website}: {selectedAgency.website}</span>
          </div>
        </div>
        <div style={css.grid3}>
          {agencyListings.map(l => (
            <PropertyCard
              key={l.id} listing={l} t={t} lang={lang}
              isFav={favorites.includes(l.id)}
              isComp={compareList.includes(l.id)}
              onToggleFav={toggleFav}
              onToggleComp={toggleComp}
              onSelect={id => { setSelectedId(id); setPage("detail"); }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderFavorites = () => {
    const favListings = ALL_LISTINGS.filter(l => favorites.includes(l.id));
    return (
      <div style={{ ...css.container, paddingTop: 24, paddingBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{t.favorites} ({favListings.length})</h2>
          {favListings.length > 0 && (
            <button style={css.btn("ghost")} onClick={() => setFavorites([])}>{t.clearAll}</button>
          )}
        </div>
        {favListings.length === 0 ? (
          <div style={css.emptyState}>{t.noFavorites}</div>
        ) : (
          <div style={css.grid3}>
            {favListings.map(l => (
              <PropertyCard
                key={l.id} listing={l} t={t} lang={lang}
                isFav={true}
                isComp={compareList.includes(l.id)}
                onToggleFav={toggleFav}
                onToggleComp={toggleComp}
                onSelect={id => { setSelectedId(id); setPage("detail"); }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCompare = () => {
    const compListings = ALL_LISTINGS.filter(l => compareList.includes(l.id));
    return (
      <div style={{ ...css.container, paddingTop: 24, paddingBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{t.compareProp} ({compListings.length}/4)</h2>
          {compListings.length > 0 && (
            <button style={css.btn("ghost")} onClick={() => setCompareList([])}>{t.clearAll}</button>
          )}
        </div>
        {compListings.length === 0 ? (
          <div style={css.emptyState}>{t.noCompare}</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={css.compareTable}>
              <thead>
                <tr>
                  <th style={css.compareTh}>{t.property}</th>
                  {compListings.map(l => (
                    <th key={l.id} style={{ ...css.compareTh, minWidth: 180 }}>
                      <img src={l.image} alt="" style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{l.title[lang]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [t.price, l => <strong>{fmt(l.price)}{l.deal === "rent" ? t.perMonth : ""}</strong>],
                  [t.type, l => t[l.type]],
                  [t.deal, l => t[l.deal]],
                  [t.location, l => l.location],
                  [t.area, l => `${l.area} ${t.sqm}`],
                  [t.beds, l => l.beds || "—"],
                  [t.baths, l => l.baths || "—"],
                  [`€/${t.sqm}`, l => l.area > 0 ? `€${Math.round(l.price / l.area)}` : "—"],
                  [t.agency, l => AGENCIES.find(a => a.id === l.agencyId)?.name],
                ].map(([label, fn], i) => (
                  <tr key={i}>
                    <td style={{ ...css.compareTd, fontWeight: 600, color: "#64748b", fontSize: 13 }}>{label}</td>
                    {compListings.map(l => <td key={l.id} style={css.compareTd}>{fn(l)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={css.app}>
      {/* NAV */}
      <nav style={css.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={css.navBrand} onClick={() => setPage("home")}>{t.brand}</div>
          <div style={css.navLinks}>
            <button style={css.navLink(page === "home")} onClick={() => setPage("home")}>{t.home}</button>
            <button style={css.navLink(page === "listings")} onClick={() => setPage("listings")}>{t.search.replace("…", "")}</button>
            <button style={css.navLink(page === "agencies")} onClick={() => setPage("agencies")}>{t.agencies}</button>
            <button style={css.navLink(page === "favorites")} onClick={() => setPage("favorites")}>
              {t.favorites}{favorites.length > 0 ? ` (${favorites.length})` : ""}
            </button>
            <button style={css.navLink(page === "compare")} onClick={() => setPage("compare")}>
              {t.compare}{compareList.length > 0 ? ` (${compareList.length})` : ""}
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button style={css.langBtn(lang === "en")} onClick={() => setLang("en")}>EN</button>
          <button style={css.langBtn(lang === "me")} onClick={() => setLang("me")}>ME</button>
          <button style={css.langBtn(lang === "ru")} onClick={() => setLang("ru")}>RU</button>
        </div>
      </nav>

      {/* PAGES */}
      {page === "home" && renderHome()}
      {page === "listings" && renderListings()}
      {page === "detail" && renderDetail()}
      {page === "agencies" && renderAgencies()}
      {page === "agency" && renderAgencyPage()}
      {page === "favorites" && renderFavorites()}
      {page === "compare" && renderCompare()}

      {/* FOOTER */}
      <div style={css.footer}>
        <div style={{ fontWeight: 700, color: "#0e7490", marginBottom: 4 }}>{t.brand}</div>
        <div>Montenegro's leading real estate platform — connecting buyers with trusted agencies</div>
        <div style={{ marginTop: 8 }}>© 2026 Nekretnine.me — All rights reserved</div>
      </div>
    </div>
  );
}
