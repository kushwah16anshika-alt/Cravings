import api from "../config/api.config.js";

// Safe Default Center Coordinate (Bengaluru / Central Food Hub)
export const DEFAULT_MAP_CENTER = {
  lat: 12.9716,
  lng: 77.5946,
};

/**
 * Searches and autocompletes addresses via backend proxy / Geoapify
 * @param {string} text - Address search query
 * @returns {Promise<Array>} List of matching address suggestions
 */
export const searchAddress = async (text) => {
  if (!text || text.trim().length < 2) return [];

  try {
    const res = await api.get("/map/geocode", {
      params: { text: text.trim() },
    });
    return res.data?.data || [];
  } catch (err) {
    console.warn("searchAddress error:", err.message);

    // Direct client fallback if VITE_GEOAPIFY_API_KEY is defined in frontend .env
    const clientKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    if (clientKey) {
      try {
        const clientRes = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            text.trim()
          )}&apiKey=${clientKey}&limit=5&format=json`
        );
        if (clientRes.ok) {
          const data = await clientRes.json();
          const items = data.results || [];
          return items.map((i) => ({
            formatted: i.formatted,
            addressLine1: i.address_line1 || i.street || "",
            addressLine2: i.address_line2 || "",
            city: i.city || "",
            state: i.state || "",
            pinCode: i.postcode || "",
            country: i.country || "India",
            lat: Number(i.lat),
            lon: Number(i.lon),
            provider: "geoapify-client",
          }));
        }
      } catch (clientErr) {
        console.warn("Client-side Geoapify autocomplete fallback warning:", clientErr.message);
      }
    }
    return [];
  }
};

/**
 * Converts latitude and longitude coordinates into a human-readable address
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Formatted address details
 */
export const reverseGeocodeCoords = async (lat, lon) => {
  if (lat === undefined || lon === undefined || isNaN(lat) || isNaN(lon)) return null;

  try {
    const res = await api.get("/map/reverse-geocode", {
      params: { lat, lon },
    });
    return res.data?.data || null;
  } catch (err) {
    console.warn("reverseGeocodeCoords error:", err.message);

    const clientKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    if (clientKey) {
      try {
        const clientRes = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${clientKey}&format=json`
        );
        if (clientRes.ok) {
          const data = await clientRes.json();
          const first = data.results?.[0];
          if (first) {
            return {
              formatted: first.formatted,
              addressLine1: first.address_line1 || "",
              addressLine2: first.address_line2 || "",
              city: first.city || "",
              state: first.state || "",
              pinCode: first.postcode || "",
              country: first.country || "India",
              lat,
              lon,
            };
          }
        }
      } catch (clientErr) {
        console.warn("Client reverse geocoding warning:", clientErr.message);
      }
    }

    return {
      formatted: `Location (${Number(lat).toFixed(4)}, ${Number(lon).toFixed(4)})`,
      addressLine1: `Location (${Number(lat).toFixed(4)}, ${Number(lon).toFixed(4)})`,
      city: "Selected Location",
      state: "",
      pinCode: "",
      country: "India",
      lat,
      lon,
    };
  }
};

/**
 * Calculates delivery route and travel metrics between two points
 * @param {number} fromLat
 * @param {number} fromLon
 * @param {number} toLat
 * @param {number} toLon
 * @param {string} [mode="motorcycle"]
 * @returns {Promise<Object>} Route coordinates [ [lat, lon], ... ], distanceKm, durationMinutes
 */
export const fetchDeliveryRoute = async (fromLat, fromLon, toLat, toLon, mode = "motorcycle") => {
  try {
    const res = await api.get("/map/route", {
      params: { fromLat, fromLon, toLat, toLon, mode },
    });
    return res.data?.data || null;
  } catch (err) {
    console.warn("fetchDeliveryRoute error:", err.message);

    // Direct client fallback if client key configured
    const clientKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    if (clientKey) {
      try {
        const clientRes = await fetch(
          `https://api.geoapify.com/v1/routing?waypoints=${fromLat},${fromLon}|${toLat},${toLon}&mode=${mode}&apiKey=${clientKey}`
        );
        if (clientRes.ok) {
          const data = await clientRes.json();
          const feature = data.features?.[0];
          if (feature) {
            const rawCoords =
              feature.geometry?.type === "LineString"
                ? feature.geometry.coordinates
                : feature.geometry?.coordinates?.flat() || [];
            const coords = rawCoords.map(([lng, lat]) => [Number(lat), Number(lng)]);
            const distM = feature.properties?.distance || 2000;
            const timeS = feature.properties?.time || 600;

            return {
              coordinates: coords.length > 0 ? coords : [[fromLat, fromLon], [toLat, toLon]],
              distanceKm: `${(distM / 1000).toFixed(1)} km`,
              distanceMeters: distM,
              durationMinutes: `${Math.max(1, Math.round(timeS / 60))} mins`,
              durationSeconds: timeS,
              estimatedMinutesNumber: Math.max(1, Math.round(timeS / 60)),
              provider: "geoapify-client",
            };
          }
        }
      } catch (clientErr) {
        console.warn("Client Geoapify routing warning:", clientErr.message);
      }
    }

    // Straightforward straight-line fallback
    return {
      coordinates: [
        [fromLat, fromLon],
        [toLat, toLon],
      ],
      distanceKm: "2.4 km",
      distanceMeters: 2400,
      durationMinutes: "12 mins",
      durationSeconds: 720,
      estimatedMinutesNumber: 12,
      isEstimate: true,
      provider: "cravings-fallback",
    };
  }
};
