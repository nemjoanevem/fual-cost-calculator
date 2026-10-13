/**
 * Routing and Geocoding Service
 * Uses OpenStreetMap Nominatim/Photon for geocoding and OSRM for driving route calculations.
 * Optionally supports Google Maps Directions API if an API key is provided.
 */

import { APP_CONFIG } from '../config.ts';

export interface LocationPoint {
  displayName: string;
  lat: number;
  lon: number;
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  originName: string;
  destinationName: string;
  source: 'osrm_free' | 'google_maps' | 'estimate';
}

const MAX_GOOGLE_CALLS_PER_SESSION = 50;
let googleCallsThisSession = 0;

/**
 * Autocomplete address search using Photon / Nominatim API
 */
export async function searchAddressSuggestions(query: string): Promise<LocationPoint[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=5`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.features && data.features.length > 0) {
        return data.features.map((feat: any) => {
          const props = feat.properties || {};
          const coords = feat.geometry?.coordinates || [0, 0];

          const parts = [
            props.name,
            props.street ? `${props.street} ${props.housenumber || ''}`.trim() : null,
            props.city || props.town || props.village,
            props.state,
            props.country,
          ].filter(Boolean);

          return {
            displayName: parts.join(', ') || props.name || trimmed,
            lon: coords[0],
            lat: coords[1],
          };
        });
      }
    }
  } catch {
    // Fallback to OpenStreetMap Nominatim if Photon is unavailable
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      trimmed
    )}&format=json&limit=5&addressdetails=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'hu,en;q=0.8',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        }));
      }
    }
  } catch {
    // Return empty array on network failure
  }

  return [];
}

/**
 * Geocode a single address to coordinates
 */
export async function geocodeAddress(address: string): Promise<LocationPoint | null> {
  const suggestions = await searchAddressSuggestions(address);
  if (suggestions.length > 0) {
    return suggestions[0];
  }
  return null;
}

/**
 * Calculate driving route between two points using OSRM
 */
async function calculateOsrmRoute(origin: LocationPoint, destination: LocationPoint): Promise<RouteResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=false`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const primary = data.routes[0];
        const distanceKm = Math.round((primary.distance / 1000) * 10) / 10;
        const durationMinutes = Math.round(primary.duration / 60);

        return {
          distanceKm,
          durationMinutes,
          originName: origin.displayName,
          destinationName: destination.displayName,
          source: 'osrm_free',
        };
      }
    }
  } catch (err) {
    console.warn('OSRM route lookup error, falling back to estimate:', err);
  }
  return null;
}

/**
 * Calculate driving route using Google Maps Directions API (optional fallback)
 */
async function calculateGoogleMapsRoute(
  originAddress: string,
  destAddress: string
): Promise<RouteResult | null> {
  if (!APP_CONFIG.googleMapsApiKey) {
    return null;
  }

  if (googleCallsThisSession >= MAX_GOOGLE_CALLS_PER_SESSION) {
    console.warn('Google Maps request session limit reached, using open routing.');
    return null;
  }

  try {
    googleCallsThisSession++;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      originAddress
    )}&destination=${encodeURIComponent(destAddress)}&key=${APP_CONFIG.googleMapsApiKey}`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'OK' && data.routes && data.routes.length > 0) {
        const leg = data.routes[0].legs[0];
        const distanceKm = Math.round(((leg.distance?.value || 0) / 1000) * 10) / 10;
        const durationMinutes = Math.round((leg.duration?.value || 0) / 60);

        return {
          distanceKm,
          durationMinutes,
          originName: leg.start_address || originAddress,
          destinationName: leg.end_address || destAddress,
          source: 'google_maps',
        };
      }
    }
  } catch (err) {
    console.warn('Google Maps request failed, falling back:', err);
  }

  return null;
}

/**
 * Great-circle Haversine road distance approximation
 */
function calculateHaversineRoadDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  const roadFactor = 1.28;
  return Math.round(straightKm * roadFactor * 10) / 10;
}

/**
 * Calculate driving distance between two addresses
 */
export async function calculateRouteBetweenAddresses(
  fromText: string,
  toText: string
): Promise<RouteResult | null> {
  const trimmedFrom = fromText.trim();
  const trimmedTo = toText.trim();

  if (!trimmedFrom || !trimmedTo) {
    return null;
  }

  // 1. Google Maps Directions if key provided
  if (APP_CONFIG.googleMapsApiKey) {
    const googleResult = await calculateGoogleMapsRoute(trimmedFrom, trimmedTo);
    if (googleResult) return googleResult;
  }

  // 2. Geocode both addresses via OpenStreetMap Photon / Nominatim
  const [fromPoint, toPoint] = await Promise.all([
    geocodeAddress(trimmedFrom),
    geocodeAddress(trimmedTo),
  ]);

  if (!fromPoint || !toPoint) {
    return null;
  }

  // 3. Query OSRM
  const osrmResult = await calculateOsrmRoute(fromPoint, toPoint);
  if (osrmResult) {
    return osrmResult;
  }

  // 4. Fallback to Haversine estimate
  const estimatedKm = calculateHaversineRoadDistance(
    fromPoint.lat,
    fromPoint.lon,
    toPoint.lat,
    toPoint.lon
  );
  const estimatedMinutes = Math.round((estimatedKm / 75) * 60);

  return {
    distanceKm: estimatedKm,
    durationMinutes: estimatedMinutes,
    originName: fromPoint.displayName,
    destinationName: toPoint.displayName,
    source: 'estimate',
  };
}
