import { describe, expect, it } from "vitest";
import { validateNominatimCandidates } from "./geocoding.js";

const address = {
  osm_type: "way",
  osm_id: 987654,
  lat: "45.5071834",
  lon: "-73.5648129",
  display_name: "100, Rue Sainte-Catherine Ouest, Montréal, Québec, H5B 1E5, Canada",
  type: "house",
  addresstype: "place",
  address: { house_number: "100", road: "Rue Sainte-Catherine Ouest", postcode: "H5B 1E5", country_code: "ca" },
};

describe("address candidate validation", () => {
  it("accepts an exact Canadian street address", () => {
    expect(validateNominatimCandidates("100 Rue Sainte-Catherine Ouest, Montréal", [address])).toEqual([{
      id: "way/987654",
      latitude: 45.5071834,
      longitude: -73.5648129,
      label: address.display_name,
      precision: "street_address",
    }]);
  });

  it("rejects a road result without a verified house number", () => {
    const streetOnly = { ...address, address: { road: "Rue Sainte-Catherine Ouest", country_code: "ca" }, type: "road" };
    expect(validateNominatimCandidates("100 Rue Sainte-Catherine Ouest", [streetOnly])).toEqual([]);
  });

  it("rejects a different house number or postal code than the customer entered", () => {
    expect(validateNominatimCandidates("102 Rue Sainte-Catherine Ouest", [address])).toEqual([]);
    expect(validateNominatimCandidates("100 Rue Sainte-Catherine Ouest H3C 0K4", [address])).toEqual([]);
  });

  it("accepts a matching postal code as an approximate area check", () => {
    const postcode = { ...address, osm_type: "relation", osm_id: 55, type: "postcode", addresstype: "postcode", address: { postcode: "H5B 1E5", country_code: "ca" } };
    expect(validateNominatimCandidates("H5B 1E5", [postcode])[0]?.precision).toBe("postal_code");
    expect(validateNominatimCandidates("H5B 1E6", [postcode])).toEqual([]);
  });

  it("rejects city-level and non-Canadian locations", () => {
    const city = { ...address, address: { city: "Montréal", country_code: "ca" }, type: "city" };
    const elsewhere = { ...address, address: { ...address.address, country_code: "us" } };
    expect(validateNominatimCandidates("Montréal", [city, elsewhere])).toEqual([]);
  });
});
