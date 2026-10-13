/**
 * Real-time Currency Exchange Rate Service
 * Fetches live exchange rates against HUF from free, reliable public APIs (no API key required).
 */

export interface ExchangeRates {
  HUF: number;
  EUR: number; // EUR to HUF multiplier (e.g. 1 EUR in HUF)
  USD: number; // USD to HUF multiplier (e.g. 1 USD in HUF)
  lastUpdated: string | null;
  isLive: boolean;
}

// Fallback market benchmark rates
const FALLBACK_RATES: ExchangeRates = {
  HUF: 1,
  EUR: 398.5, // 1 EUR = ~398.5 HUF
  USD: 367.2, // 1 USD = ~367.2 HUF
  lastUpdated: null,
  isLive: false,
};

let cachedRates: ExchangeRates = { ...FALLBACK_RATES };

/**
 * Fetch live exchange rates for HUF, EUR, USD
 */
export async function fetchLiveExchangeRates(): Promise<ExchangeRates> {
  // Method 1: open.er-api.com (free, updated daily, CORS enabled)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://open.er-api.com/v6/latest/HUF', {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        // rates contains rate from HUF to EUR (e.g. 0.00251)
        const hufToEur = data.rates.EUR;
        const hufToUsd = data.rates.USD;

        if (hufToEur && hufToUsd) {
          cachedRates = {
            HUF: 1,
            EUR: 1 / hufToEur, // how many HUF for 1 EUR
            USD: 1 / hufToUsd, // how many HUF for 1 USD
            lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isLive: true,
          };
          return cachedRates;
        }
      }
    }
  } catch {
    // Try method 2
  }

  // Method 2: frankfurter.dev (ECB reference rates)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=EUR&symbols=HUF,USD', {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && data.rates.HUF) {
        const eurHuf = data.rates.HUF;
        const eurUsd = data.rates.USD || 1.08;
        const usdHuf = eurHuf / eurUsd;

        cachedRates = {
          HUF: 1,
          EUR: eurHuf,
          USD: usdHuf,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLive: true,
        };
        return cachedRates;
      }
    }
  } catch {
    // Fallback
  }

  return cachedRates;
}

export function getCachedRates(): ExchangeRates {
  return cachedRates;
}
