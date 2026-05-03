export const LOCATIONS = [
  { name: "Budva",       lat: 42.2914, lng: 18.8400 },
  { name: "Kotor",       lat: 42.4247, lng: 18.7712 },
  { name: "Tivat",       lat: 42.4319, lng: 18.6968 },
  { name: "Podgorica",   lat: 42.4304, lng: 19.2594 },
  { name: "Herceg Novi", lat: 42.4531, lng: 18.5375 },
  { name: "Bar",         lat: 42.0931, lng: 19.1003 },
  { name: "Ulcinj",      lat: 41.9297, lng: 19.2064 },
  { name: "Cetinje",     lat: 42.3931, lng: 18.9236 },
  { name: "Nikšić",      lat: 42.7731, lng: 18.9444 },
  { name: "Luštica",     lat: 42.3878, lng: 18.6756 },
  { name: "Žabljak",     lat: 43.1554, lng: 19.1226 },
  { name: "Sveti Stefan",lat: 42.2580, lng: 18.8920 },
] as const;

export type CityName = (typeof LOCATIONS)[number]["name"];

export function findCity(name: string) {
  return LOCATIONS.find((l) => l.name === name);
}
