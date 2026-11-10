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
  postcode?: string;
  city?: string;
  country?: string;
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  originName: string;
  destinationName: string;
  source: 'osrm_free' | 'google_maps' | 'estimate';
}

export interface RoutingOptions {
  avoidTolls?: boolean;
  avoidFerries?: boolean;
}

const MAX_GOOGLE_CALLS_PER_SESSION = 50;
let googleCallsThisSession = 0;

/**
 * Autocomplete address search using Photon / Nominatim API.
 * Ensures postcode (irányítószám) and district/locality are clearly included
 * so identical streets/places can be distinguished accurately.
 */
export async function searchAddressSuggestions(query: string): Promise<LocationPoint[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=6`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.features && data.features.length > 0) {
        return data.features.map((feat: any) => {
          const props = feat.properties || {};
          const coords = feat.geometry?.coordinates || [0, 0];

          const street = props.street
            ? `${props.street} ${props.housenumber || ''}`.trim()
            : (props.type === 'street' || props.type === 'house' ? props.name : null);
          const name = props.name && props.name !== street ? props.name : null;
          const district = props.district || props.locality || null;
          const city = props.city || props.town || props.village || null;
          const postcode = props.postcode ? String(props.postcode).trim() : null;
          const country = props.country || null;

          // Assemble location with postcode first or attached to city:
          // Example: "Fő utca, 1011 Budapest (I. kerület), Magyarország"
          // Or: "1011 Budapest, Fő utca"
          const cityWithPostcode = postcode && city
            ? `${postcode} ${city}`
            : (city || postcode || null);

          const parts: string[] = [];
          if (street) parts.push(street);
          if (name && !street) parts.push(name);
          if (district && district !== city) parts.push(district);
          if (cityWithPostcode) parts.push(cityWithPostcode);
          if (country) parts.push(country);

          const displayName = parts.filter(Boolean).join(', ') || props.name || trimmed;

          return {
            displayName,
            lon: coords[0],
            lat: coords[1],
            postcode: postcode || undefined,
            city: city || undefined,
            country: country || undefined,
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
    )}&format=json&limit=6&addressdetails=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'hu,en;q=0.8',
        'User-Agent': 'FuelCalculatorApp/1.0 (https://fuelcalc.app)',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((item: any) => {
          const addr = item.address || {};
          const postcode = addr.postcode ? String(addr.postcode).trim() : null;
          const road = addr.road || addr.pedestrian || addr.highway || null;
          const houseNumber = addr.house_number || '';
          const street = road ? `${road} ${houseNumber}`.trim() : null;
          const suburb = addr.suburb || addr.borough || addr.neighbourhood || null;
          const city = addr.city || addr.town || addr.village || addr.municipality || null;
          const country = addr.country || null;

          let displayName = item.display_name;
          if (street || city) {
            const cityWithPostcode = postcode && city ? `${postcode} ${city}` : (city || postcode || null);
            const parts = [
              street || item.name,
              suburb && suburb !== city ? suburb : null,
              cityWithPostcode,
              country,
            ].filter(Boolean);
            if (parts.length > 1) {
              displayName = parts.join(', ');
            }
          }

          return {
            displayName,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            postcode: postcode || undefined,
            city: city || undefined,
            country: country || undefined,
          };
        });
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
 * Calculate driving route between two points using OSRM with toll and ferry avoidance options
 */
async function calculateOsrmRoute(
  origin: LocationPoint,
  destination: LocationPoint,
  options?: RoutingOptions
): Promise<RouteResult | null> {
  const excludeParts: string[] = [];
  if (options?.avoidTolls) excludeParts.push('toll');
  if (options?.avoidFerries) excludeParts.push('ferry');

  const excludeParam = excludeParts.length > 0 ? `&exclude=${excludeParts.join(',')}` : '';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);

    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=false${excludeParam}`;
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

    // Fallback: if server rejects exclude parameter, query base and apply standard non-toll detour calculation
    if (excludeParam) {
      const fallbackUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=false`;
      const fallbackRes = await fetch(fallbackUrl);
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        if (fallbackData.code === 'Ok' && fallbackData.routes && fallbackData.routes.length > 0) {
          const primary = fallbackData.routes[0];
          const detourFactor = options?.avoidTolls ? 1.12 : 1;
          const distanceKm = Math.round((primary.distance / 1000) * detourFactor * 10) / 10;
          const durationMinutes = Math.round((primary.duration / 60) * (options?.avoidTolls ? 1.25 : 1));

          return {
            distanceKm,
            durationMinutes,
            originName: origin.displayName,
            destinationName: destination.displayName,
            source: 'osrm_free',
          };
        }
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
  destAddress: string,
  options?: RoutingOptions
): Promise<RouteResult | null> {
  if (!APP_CONFIG.googleMapsApiKey) {
    return null;
  }

  if (googleCallsThisSession >= MAX_GOOGLE_CALLS_PER_SESSION) {
    console.warn('Google Maps request session limit reached, using open routing.');
    return null;
  }

  const avoidParts: string[] = [];
  if (options?.avoidTolls) avoidParts.push('tolls');
  if (options?.avoidFerries) avoidParts.push('ferries');
  const avoidParam = avoidParts.length > 0 ? `&avoid=${avoidParts.join('|')}` : '';

  try {
    googleCallsThisSession++;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      originAddress
    )}&destination=${encodeURIComponent(destAddress)}&key=${APP_CONFIG.googleMapsApiKey}${avoidParam}`;

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
 * Calculate driving distance between two addresses with toll and ferry options
 */
export async function calculateRouteBetweenAddresses(
  fromText: string,
  toText: string,
  options?: RoutingOptions
): Promise<RouteResult | null> {
  const trimmedFrom = fromText.trim();
  const trimmedTo = toText.trim();

  if (!trimmedFrom || !trimmedTo) {
    return null;
  }

  // 1. Google Maps Directions if key provided
  if (APP_CONFIG.googleMapsApiKey) {
    const googleResult = await calculateGoogleMapsRoute(trimmedFrom, trimmedTo, options);
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

  // 3. Query OSRM with options
  const osrmResult = await calculateOsrmRoute(fromPoint, toPoint, options);
  if (osrmResult) {
    return osrmResult;
  }

  // 4. Fallback to Haversine estimate
  const detourFactor = options?.avoidTolls ? 1.15 : 1;
  const estimatedKm = Math.round(
    calculateHaversineRoadDistance(fromPoint.lat, fromPoint.lon, toPoint.lat, toPoint.lon) * detourFactor * 10
  ) / 10;
  const estimatedMinutes = Math.round((estimatedKm / 75) * 60);

  return {
    distanceKm: estimatedKm,
    durationMinutes: estimatedMinutes,
    originName: fromPoint.displayName,
    destinationName: toPoint.displayName,
    source: 'estimate',
  };
}
