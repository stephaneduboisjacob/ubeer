import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { pointInRegion } from "./geofence.js";

const downtown = {
  type: "Polygon",
  coordinates: [[[-123.374, 48.418], [-123.354, 48.418], [-123.354, 48.431], [-123.374, 48.431], [-123.374, 48.418]]],
};

const montrealIsland = JSON.parse(readFileSync(fileURLToPath(new URL("../prisma/data/montreal-island.geojson", import.meta.url)), "utf8")) as unknown;

describe("pointInRegion", () => {
  it("includes coordinates inside a GeoJSON polygon", () => {
    expect(pointInRegion({ latitude: 48.424, longitude: -123.364 }, downtown)).toBe(true);
  });

  it("rejects coordinates outside the service polygon", () => {
    expect(pointInRegion({ latitude: 48.44, longitude: -123.364 }, downtown)).toBe(false);
  });

  it("respects polygon holes", () => {
    const polygonWithHole = {
      type: "Polygon",
      coordinates: [
        [[-124, 48], [-122, 48], [-122, 50], [-124, 50], [-124, 48]],
        [[-123.5, 48.5], [-122.5, 48.5], [-122.5, 49.5], [-123.5, 49.5], [-123.5, 48.5]],
      ],
    };
    expect(pointInRegion({ latitude: 49, longitude: -123 }, polygonWithHole)).toBe(false);
    expect(pointInRegion({ latitude: 48.25, longitude: -123 }, polygonWithHole)).toBe(true);
  });

  it("supports circles with radius in metres", () => {
    const circle = { type: "Circle", coordinates: [-123.364, 48.424] as [number, number], radius: 1000 };
    expect(pointInRegion({ latitude: 48.424, longitude: -123.364 }, circle)).toBe(true);
    expect(pointInRegion({ latitude: 48.45, longitude: -123.364 }, circle)).toBe(false);
  });

  it("covers Montréal Island and excludes nearby mainland municipalities", () => {
    expect(pointInRegion({ latitude: 45.5019, longitude: -73.5674 }, montrealIsland)).toBe(true); // Downtown Montréal
    expect(pointInRegion({ latitude: 45.4706, longitude: -73.7408 }, montrealIsland)).toBe(true); // Montréal–Trudeau airport
    expect(pointInRegion({ latitude: 45.57, longitude: -73.72 }, montrealIsland)).toBe(false); // Laval
    expect(pointInRegion({ latitude: 45.53, longitude: -73.52 }, montrealIsland)).toBe(false); // Longueuil
  });
});
