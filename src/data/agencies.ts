import type { Agency } from "@/types";

export const AGENCIES: Agency[] = [
  {
    id: "1",
    slug: "adriatic-homes",
    name: "Adriatic Homes",
    logo: "🏠",
    color: "#0e7490",
    phone: "+382 67 123 456",
    email: "info@adriatichomes.me",
    website: "adriatichomes.me",
    listingsCount: 48,
    verified: true,
    description: {
      en: "Premium coastal properties in Budva, Kotor and Tivat. Serving international clients since 2010.",
      me: "Vrhunske nekretnine na primorju u Budvi, Kotoru i Tivtu. Radimo s domaćim i inostranim klijentima od 2010.",
      ru: "Премиальная недвижимость на побережье Будвы, Котора и Тивата. Работаем с местными и зарубежными клиентами с 2010 года.",
    },
  },
  {
    id: "2",
    slug: "montenegro-invest",
    name: "Montenegro Invest",
    logo: "📈",
    color: "#7c3aed",
    phone: "+382 69 234 567",
    email: "contact@mne-invest.com",
    website: "mne-invest.com",
    listingsCount: 35,
    verified: true,
    description: {
      en: "Investment-grade properties and development projects across Montenegro.",
      me: "Nekretnine za ulaganje i razvojni projekti širom Crne Gore.",
      ru: "Инвестиционная недвижимость и девелоперские проекты по всей Черногории.",
    },
  },
  {
    id: "3",
    slug: "boka-bay-realty",
    name: "Boka Bay Realty",
    logo: "⛵",
    color: "#0369a1",
    phone: "+382 68 345 678",
    email: "hello@bokabay.me",
    website: "bokabay.me",
    listingsCount: 29,
    verified: true,
    description: {
      en: "Specialists in Boka Bay waterfront living — from historic stone houses to modern marina apartments.",
      me: "Specijalisti za nekretnine uz more u Boki Kotorskoj — od kamenih kuća do modernih stanova u marinama.",
      ru: "Эксперты по недвижимости у моря в Бока-Которском заливе — от старинных каменных домов до современных апартаментов у марины.",
    },
  },
  {
    id: "4",
    slug: "capital-estate",
    name: "Capital Estate",
    logo: "🏛️",
    color: "#b45309",
    phone: "+382 20 456 789",
    email: "info@capitalestate.me",
    website: "capitalestate.me",
    listingsCount: 22,
    verified: true,
    description: {
      en: "Podgorica's leading agency for residential and commercial real estate.",
      me: "Vodeća podgorička agencija za stambene i poslovne nekretnine.",
      ru: "Ведущее агентство Подгорицы по жилой и коммерческой недвижимости.",
    },
  },
  {
    id: "5",
    slug: "lustica-villas",
    name: "Lustica Villas",
    logo: "🌿",
    color: "#15803d",
    phone: "+382 67 567 890",
    email: "villas@lustica.me",
    website: "lustica.me",
    listingsCount: 18,
    verified: false,
    description: {
      en: "Exclusive villa developments on the Luštica peninsula with sea views.",
      me: "Ekskluzivni projekti vila na poluostrvu Luštica sa pogledom na more.",
      ru: "Эксклюзивные виллы на полуострове Луштица с видом на море.",
    },
  },
];

export function findAgencyById(id: string) {
  return AGENCIES.find((a) => a.id === id);
}

export function findAgencyBySlug(slug: string) {
  return AGENCIES.find((a) => a.slug === slug);
}
