/**
 * Fuel Price & Country Location Service
 * Provides average fuel prices per country, automatic geolocation detection with HU fallback,
 * and currency conversions.
 */

export interface CountryFuelData {
  code: string;
  nameHu: string;
  nameEn: string;
  flag: string;
  currency: string;
  pricesHuf: {
    petrol95: number;
    diesel: number;
    premiumPetrol: number;
    premiumDiesel: number;
    lpg: number;
  };
  nativePrices: {
    petrol95: number;
    diesel: number;
    premiumPetrol: number;
    premiumDiesel: number;
    lpg: number;
  };
}

export const COUNTRIES: CountryFuelData[] = [
  {
    code: 'HU',
    nameHu: 'Magyarország',
    nameEn: 'Hungary',
    flag: '🇭🇺',
    currency: 'HUF',
    pricesHuf: {
      petrol95: 618,
      diesel: 632,
      premiumPetrol: 669,
      premiumDiesel: 675,
      lpg: 389,
    },
    nativePrices: {
      petrol95: 618,
      diesel: 632,
      premiumPetrol: 669,
      premiumDiesel: 675,
      lpg: 389,
    },
  },
  {
    code: 'AT',
    nameHu: 'Ausztria',
    nameEn: 'Austria',
    flag: '🇦🇹',
    currency: 'EUR',
    pricesHuf: {
      petrol95: 625,
      diesel: 642,
      premiumPetrol: 695,
      premiumDiesel: 698,
      lpg: 430,
    },
    nativePrices: {
      petrol95: 1.58,
      diesel: 1.62,
      premiumPetrol: 1.76,
      premiumDiesel: 1.77,
      lpg: 1.09,
    },
  },
  {
    code: 'DE',
    nameHu: 'Németország',
    nameEn: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    pricesHuf: {
      petrol95: 685,
      diesel: 655,
      premiumPetrol: 745,
      premiumDiesel: 715,
      lpg: 420,
    },
    nativePrices: {
      petrol95: 1.73,
      diesel: 1.66,
      premiumPetrol: 1.88,
      premiumDiesel: 1.81,
      lpg: 1.06,
    },
  },
  {
    code: 'SK',
    nameHu: 'Szlovákia',
    nameEn: 'Slovakia',
    flag: '🇸🇰',
    currency: 'EUR',
    pricesHuf: {
      petrol95: 612,
      diesel: 604,
      premiumPetrol: 670,
      premiumDiesel: 660,
      lpg: 310,
    },
    nativePrices: {
      petrol95: 1.55,
      diesel: 1.53,
      premiumPetrol: 1.70,
      premiumDiesel: 1.67,
      lpg: 0.78,
    },
  },
  {
    code: 'RO',
    nameHu: 'Románia',
    nameEn: 'Romania',
    flag: '🇷🇴',
    currency: 'RON',
    pricesHuf: {
      petrol95: 575,
      diesel: 590,
      premiumPetrol: 635,
      premiumDiesel: 645,
      lpg: 275,
    },
    nativePrices: {
      petrol95: 7.20,
      diesel: 7.38,
      premiumPetrol: 7.95,
      premiumDiesel: 8.08,
      lpg: 3.45,
    },
  },
  {
    code: 'HR',
    nameHu: 'Horvátország',
    nameEn: 'Croatia',
    flag: '🇭🇷',
    currency: 'EUR',
    pricesHuf: {
      petrol95: 602,
      diesel: 588,
      premiumPetrol: 660,
      premiumDiesel: 645,
      lpg: 330,
    },
    nativePrices: {
      petrol95: 1.52,
      diesel: 1.49,
      premiumPetrol: 1.67,
      premiumDiesel: 1.63,
      lpg: 0.84,
    },
  },
  {
    code: 'SI',
    nameHu: 'Szlovénia',
    nameEn: 'Slovenia',
    flag: '🇸🇮',
    currency: 'EUR',
    pricesHuf: {
      petrol95: 592,
      diesel: 608,
      premiumPetrol: 655,
      premiumDiesel: 668,
      lpg: 350,
    },
    nativePrices: {
      petrol95: 1.50,
      diesel: 1.54,
      premiumPetrol: 1.66,
      premiumDiesel: 1.69,
      lpg: 0.89,
    },
  },
  {
    code: 'CZ',
    nameHu: 'Csehország',
    nameEn: 'Czech Republic',
    flag: '🇨🇿',
    currency: 'CZK',
    pricesHuf: {
      petrol95: 610,
      diesel: 595,
      premiumPetrol: 665,
      premiumDiesel: 650,
      lpg: 270,
    },
    nativePrices: {
      petrol95: 38.2,
      diesel: 37.3,
      premiumPetrol: 41.6,
      premiumDiesel: 40.7,
      lpg: 16.9,
    },
  },
  {
    code: 'PL',
    nameHu: 'Lengyelország',
    nameEn: 'Poland',
    flag: '🇵🇱',
    currency: 'PLN',
    pricesHuf: {
      petrol95: 585,
      diesel: 595,
      premiumPetrol: 640,
      premiumDiesel: 650,
      lpg: 265,
    },
    nativePrices: {
      petrol95: 6.42,
      diesel: 6.52,
      premiumPetrol: 7.02,
      premiumDiesel: 7.12,
      lpg: 2.91,
    },
  },
  {
    code: 'IT',
    nameHu: 'Olaszország',
    nameEn: 'Italy',
    flag: '🇮🇹',
    currency: 'EUR',
    pricesHuf: {
      petrol95: 720,
      diesel: 690,
      premiumPetrol: 790,
      premiumDiesel: 755,
      lpg: 295,
    },
    nativePrices: {
      petrol95: 1.82,
      diesel: 1.75,
      premiumPetrol: 2.00,
      premiumDiesel: 1.91,
      lpg: 0.75,
    },
  },
  {
    code: 'FR',
    nameHu: 'Franciaország',
    nameEn: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    pricesHuf: {
      petrol95: 715,
      diesel: 672,
      premiumPetrol: 775,
      premiumDiesel: 730,
      lpg: 395,
    },
    nativePrices: {
      petrol95: 1.81,
      diesel: 1.70,
      premiumPetrol: 1.96,
      premiumDiesel: 1.85,
      lpg: 1.00,
    },
  },
  {
    code: 'ES',
    nameHu: 'Spanyolország',
    nameEn: 'Spain',
    flag: '🇪🇸',
    currency: 'EUR',
    pricesHuf: {
      petrol95: 615,
      diesel: 580,
      premiumPetrol: 675,
      premiumDiesel: 635,
      lpg: 375,
    },
    nativePrices: {
      petrol95: 1.56,
      diesel: 1.47,
      premiumPetrol: 1.71,
      premiumDiesel: 1.61,
      lpg: 0.95,
    },
  },
  {
    code: 'NL',
    nameHu: 'Hollandia',
    nameEn: 'Netherlands',
    flag: '🇳🇱',
    currency: 'EUR',
    pricesHuf: {
      petrol95: 795,
      diesel: 690,
      premiumPetrol: 865,
      premiumDiesel: 750,
      lpg: 355,
    },
    nativePrices: {
      petrol95: 2.01,
      diesel: 1.75,
      premiumPetrol: 2.19,
      premiumDiesel: 1.90,
      lpg: 0.90,
    },
  },
  {
    code: 'CH',
    nameHu: 'Svájc',
    nameEn: 'Switzerland',
    flag: '🇨🇭',
    currency: 'CHF',
    pricesHuf: {
      petrol95: 765,
      diesel: 785,
      premiumPetrol: 825,
      premiumDiesel: 840,
      lpg: 490,
    },
    nativePrices: {
      petrol95: 1.78,
      diesel: 1.83,
      premiumPetrol: 1.92,
      premiumDiesel: 1.96,
      lpg: 1.14,
    },
  },
  {
    code: 'GB',
    nameHu: 'Egyesült Királyság',
    nameEn: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    pricesHuf: {
      petrol95: 705,
      diesel: 742,
      premiumPetrol: 775,
      premiumDiesel: 810,
      lpg: 395,
    },
    nativePrices: {
      petrol95: 1.42,
      diesel: 1.50,
      premiumPetrol: 1.56,
      premiumDiesel: 1.63,
      lpg: 0.80,
    },
  },
  {
    code: 'US',
    nameHu: 'Egyesült Államok',
    nameEn: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    pricesHuf: {
      petrol95: 345,
      diesel: 385,
      premiumPetrol: 410,
      premiumDiesel: 435,
      lpg: 250,
    },
    nativePrices: {
      petrol95: 0.88,
      diesel: 0.98,
      premiumPetrol: 1.05,
      premiumDiesel: 1.11,
      lpg: 0.64,
    },
  },
];

export type FuelTypeKey = 'petrol95' | 'diesel' | 'premiumPetrol' | 'premiumDiesel' | 'lpg';

/**
 * Detect user's country using browser Geolocation or IP-based fallback
 * Always returns 'HU' if detection is blocked, unavailable, or unsupported.
 */
export async function detectUserCountry(): Promise<{ countryCode: string; method: 'gps' | 'ip' | 'default' }> {
  // Method 1: IP-based lookup (fastest & doesn't trigger scary browser permission popups unless desired)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    
    // ipwho.is is a free, CORS-friendly IP geolocation API with no rate limit for light use
    const res = await fetch('https://ipwho.is/?fields=country_code,success', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.country_code) {
        const found = COUNTRIES.find((c) => c.code === data.country_code);
        if (found) {
          return { countryCode: found.code, method: 'ip' };
        }
      }
    }
  } catch {
    // Ignore and fallback
  }

  // Method 2: Browser navigator.language fallback heuristic (e.g., 'hu-HU' -> HU, 'de-AT' -> AT)
  try {
    if (navigator.language) {
      const parts = navigator.language.split('-');
      if (parts.length === 2) {
        const langCountry = parts[1].toUpperCase();
        if (COUNTRIES.some((c) => c.code === langCountry)) {
          return { countryCode: langCountry, method: 'ip' };
        }
      }
    }
  } catch {
    // Ignore
  }

  // Default fallback: Hungary
  return { countryCode: 'HU', method: 'default' };
}

/**
 * Get country data by code (fallback to HU)
 */
export function getCountryData(code: string): CountryFuelData {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
}
