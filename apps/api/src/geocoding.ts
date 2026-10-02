import { z } from "zod";

const nominatimAddressSchema = z.object({
  house_number: z.string().optional(),
  road: z.string().optional(),
  pedestrian: z.string().optional(),
  residential: z.string().optional(),
  postcode: z.string().optional(),
  country_code: z.string().optional(),
}).passthrough();

const nominatimResultSchema = z.object({
  osm_type: z.string(),
  osm_id: z.union([z.string(), z.number()]),
  lat: z.string(),
  lon: z.string(),
  display_name: z.string().min(1),
  type: z.string().optional(),
  addresstype: z.string().optional(),
  address: nominatimAddressSchema.optional(),
}).passthrough();

export type AddressCandidate = {
  id: string;
  latitude: number;
  longitude: number;
  label: string;
  precision: "street_address" | "postal_code";
};

function normalized(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function requestedHouseNumber(query: string): string | undefined {
  // Supports Québec unit prefixes such as 4-1200 Rue Sainte-Catherine.
  const match = /^\s*(?:#?\d+[A-Za-z]?[-/])?(\d+[A-Za-z]?)\s+(?=\p{L})/iu.exec(query);
  return match?.[1] ? normalized(match[1]) : undefined;
}

function requestedPostcode(query: string): string | undefined {
  const match = /\b([A-Z]\d[A-Z][ -]?\d[A-Z]\d)\b/i.exec(query);
  return match?.[1] ? normalized(match[1]) : undefined;
}

export function validateNominatimCandidates(query: string, rawResults: unknown): AddressCandidate[] {
  const parsed = z.array(nominatimResultSchema).safeParse(rawResults);
  if (!parsed.success) return [];

  const houseNumberQuery = requestedHouseNumber(query);
  const postcodeQuery = requestedPostcode(query);
  const candidates: AddressCandidate[] = [];
  const seen = new Set<string>();

  for (const result of parsed.data) {
    const address = result.address;
    if (!address || address.country_code?.toLowerCase() !== "ca") continue;
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) continue;

    const road = address.road ?? address.pedestrian ?? address.residential;
    const hasStreetAddress = Boolean(address.house_number && road);
    const isPostalCode = Boolean(address.postcode && (result.addresstype === "postcode" || result.type === "postcode"));
    if (postcodeQuery && normalized(address.postcode ?? "") !== postcodeQuery) continue;
    if (houseNumberQuery && normalized(address.house_number ?? "") !== houseNumberQuery) continue;

    let precision: AddressCandidate["precision"];
    if (postcodeQuery && !houseNumberQuery) {
      if (!isPostalCode) continue;
      precision = "postal_code";
    } else if (hasStreetAddress) precision = "street_address";
    else continue;

    const pointKey = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
    if (seen.has(pointKey)) continue;
    seen.add(pointKey);
    candidates.push({ id: `${result.osm_type}/${result.osm_id}`, latitude, longitude, label: result.display_name, precision });
  }

  return candidates;
}

let requestQueue: Promise<void> = Promise.resolve();
let nextNominatimRequestAt = 0;

async function fetchNominatim(url: string): Promise<Response> {
  const request = requestQueue.then(async () => {
    const waitMs = Math.max(0, nextNominatimRequestAt - Date.now());
    if (waitMs > 0) await new Promise((resolve) => setTimeout(resolve, waitMs));
    nextNominatimRequestAt = Date.now() + 1_100;
    return fetch(url, {
      headers: { "User-Agent": "uBeer/0.1 (https://ubeer.btcpay.exchange; admin@btcpay.exchange)" },
      signal: AbortSignal.timeout(8_000),
    });
  });
  requestQueue = request.then(() => undefined, () => undefined);
  return request;
}

export async function searchAddressCandidates(query: string): Promise<AddressCandidate[]> {
  const parameters = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "1",
    limit: "8",
    countrycodes: "ca",
    "accept-language": "fr,en",
    viewbox: "-73.9764204,45.7029000,-73.4761443,45.4021694",
    q: query,
  });
  const response = await fetchNominatim(`https://nominatim.openstreetmap.org/search?${parameters}`);
  if (!response.ok) throw new Error("Address lookup is temporarily unavailable");
  const result = validateNominatimCandidates(query, await response.json());
  return result.slice(0, 5);
}
