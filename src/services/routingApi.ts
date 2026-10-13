/**
 * Routing & Geocoding Service
 * Uses 100% FREE OpenStreetMap Nominatim/Photon and OSRM (Open Source Routing Machine).
 * No billing, no credit card, and zero API keys required.
 * Optional Google Maps integration with strict call limit to prevent accidental billing.
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

// Session call counter for Google Maps to strictly enforce free tier limits
let googleCallsThisSession = 0;

/**
 * Autocomplete address search using free Photon / Nominatim API
 */
export async function searchAddressSuggestions(query: string): Promise<LocationPoint[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    // Photon API (komoot) is super fast, free, and based on OpenStreetMap
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
    // Fallback to OpenStreetMap Nominatim if photon has a hiccup
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
    // Return empty on network issues
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
 * Calculate driving route between two points using FREE OSRM API
 */
async function calculateOsrmRoute(origin: LocationPoint, destination: LocationPoint): Promise<RouteResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    // OSRM Public Driving Server: coordinates are {lon},{lat}
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
 * Calculate driving route using Google Maps Directions API (Optional, with strict safety limit)
 */
async function calculateGoogleMapsRoute(
  originAddress: string,
  destAddress: string
): Promise<RouteResult | null> {
  if (!APP_CONFIG.googleMapsApiKey) {
    return null;
  }

  if (googleCallsThisSession >= APP_CONFIG.googleMapsSessionLimit) {
    console.warn(
      `Google Maps call limit reached (${APP_CONFIG.googleMapsSessionLimit}). Switching to free OSRM to prevent billing.`
    );
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
 * Great-circle Haversine distance with road winding coefficient as backup
 */
function calculateHaversineRoadDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
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
  
  // Real road routes are approximately 1.25x - 1.3x straight distance
  const roadFactor = 1.28;
  return Math.round(straightKm * roadFactor * 10) / 10;
}

/**
 * Main function: calculate route between 2 addresses or points
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

  // 1. If Google Maps is enabled in config and has API key
  if (APP_CONFIG.routingProvider === 'google' && APP_CONFIG.googleMapsApiKey) {
    const googleResult = await calculateGoogleMapsRoute(trimmedFrom, trimmedTo);
    if (googleResult) return googleResult;
  }

  // 2. Geocode both addresses via free OpenStreetMap Photon / Nominatim
  const [fromPoint, toPoint] = await Promise.all([
    geocodeAddress(trimmedFrom),
    geocodeAddress(trimmedTo),
  ]);

  if (!fromPoint || !toPoint) {
    return null;
  }

  // 3. Query free OSRM Driving Engine
  const osrmResult = await calculateOsrmRoute(fromPoint, toPoint);
  if (osrmResult) {
    return osrmResult;
  }

  // 4. Fallback: Haversine road estimate
  const estimatedKm = calculateHaversineRoadDistance(
    fromPoint.lat,
    fromPoint.lon,
    toPoint.lat,
    toPoint.lon
  );
  const estimatedMinutes = Math.round((estimatedKm / 75) * 60); // approx 75 km/h average speed

  return {
    distanceKm: estimatedKm,
    durationMinutes: estimatedMinutes,
    originName: fromPoint.displayName,
    destinationName: toPoint.displayName,
    source: 'estimate',
  };
}
