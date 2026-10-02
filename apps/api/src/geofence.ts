import type { Coordinate } from "@ubeer/shared";

type Position = [number, number];
type GeoJson =
  | { type: "Polygon"; coordinates: Position[][] }
  | { type: "MultiPolygon"; coordinates: Position[][][] }
  | { type: "Circle"; coordinates: Position; radius: number }
  | { type: "Feature"; geometry: Exclude<GeoJson, { type: "Feature" }>; properties?: Record<string, unknown> };

function onSegment(point: Position, a: Position, b: Position): boolean {
  if (a[0] === b[0] && a[1] === b[1]) return point[0] === a[0] && point[1] === a[1];
  const cross = (point[1] - a[1]) * (b[0] - a[0]) - (point[0] - a[0]) * (b[1] - a[1]);
  if (Math.abs(cross) > 1e-10) return false;
  const dot = (point[0] - a[0]) * (b[0] - a[0]) + (point[1] - a[1]) * (b[1] - a[1]);
  return dot >= 0 && dot <= (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2;
}

function inRing(point: Position, ring: Position[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[j]!;
    const b = ring[i]!;
    if (onSegment(point, a, b)) return true;
    const crosses = (b[1] > point[1]) !== (a[1] > point[1]) &&
      point[0] < ((a[0] - b[0]) * (point[1] - b[1])) / (a[1] - b[1]) + b[0];
    if (crosses) inside = !inside;
  }
  return inside;
}

function inPolygon(point: Position, rings: Position[][]): boolean {
  const [outer, ...holes] = rings;
  return !!outer && inRing(point, outer) && !holes.some((hole) => inRing(point, hole));
}

function distanceMeters(a: Position, b: Position): number {
  const rad = (degree: number) => (degree * Math.PI) / 180;
  const dLat = rad(b[1] - a[1]);
  const dLon = rad(b[0] - a[0]);
  const lat1 = rad(a[1]);
  const lat2 = rad(b[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function pointInRegion(coordinate: Coordinate, raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return false;
  const geo = raw as GeoJson;
  if (geo.type === "Feature") return pointInRegion(coordinate, geo.geometry);
  const point: Position = [coordinate.longitude, coordinate.latitude];
  if (geo.type === "Circle") {
    return Array.isArray(geo.coordinates) && typeof geo.radius === "number" && geo.radius > 0 &&
      distanceMeters(point, geo.coordinates) <= geo.radius;
  }
  if (geo.type === "Polygon") return Array.isArray(geo.coordinates) && inPolygon(point, geo.coordinates);
  if (geo.type === "MultiPolygon") return Array.isArray(geo.coordinates) && geo.coordinates.some((poly) => inPolygon(point, poly));
  return false;
}

export function distanceBetween(a: Coordinate, b: Coordinate): number {
  return distanceMeters([a.longitude, a.latitude], [b.longitude, b.latitude]);
}
