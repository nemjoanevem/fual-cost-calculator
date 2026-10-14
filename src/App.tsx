/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { TripForm } from './components/TripForm.tsx';
import { FuelSelector } from './components/FuelSelector.tsx';
import { AmortizationSelector } from './components/AmortizationSelector.tsx';
import { CostSummary } from './components/CostSummary.tsx';
import { InfoGuide } from './components/InfoGuide.tsx';
import { Footer } from './components/Footer.tsx';
import { APP_CONFIG } from './config.ts';
import {
  COUNTRIES,
  CountryFuelData,
  FuelTypeKey,
  detectUserCountry,
  getCountryData,
  getFuelPricesCache,
  checkAndUpdateFuelPrices,
  formatLastUpdatedDate,
  FuelPricesCache,
} from './services/fuelApi.ts';
import { fetchLiveExchangeRates, getCachedRates, ExchangeRates } from './services/currencyApi.ts';
import { Language, translations } from './translations.ts';

export default function App() {
  // Localization & Currency
  const [lang, setLang] = useState<Language>('hu');
  const [currency, setCurrency] = useState<'HUF' | 'EUR' | 'USD'>('HUF');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(getCachedRates());

  // Cached fuel prices & country selection
  const [fuelCache, setFuelCache] = useState<FuelPricesCache>(() => getFuelPricesCache());
  const [selectedCountry, setSelectedCountry] = useState<CountryFuelData>(() =>
    getCountryData(APP_CONFIG.defaultCountry || 'HU', fuelCache.countries)
  );
  const [selectedFuelType, setSelectedFuelType] = useState<FuelTypeKey>('petrol95');
  const [customPriceEnabled, setCustomPriceEnabled] = useState(false);
  const [customPrice, setCustomPrice] = useState<number>(620);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Trip details
  const [tripMode, setTripMode] = useState<'route' | 'direct'>('direct');
  const [fromAddress, setFromAddress] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [distanceKm, setDistanceKm] = useState<number>(120);
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
  const [consumptionL100, setConsumptionL100] = useState<number>(6.5);
  const [passengerCount, setPassengerCount] = useState<number>(1);

  // Vehicle amortization fee (+15 HUF/km by default)
  const [amortizationEnabled, setAmortizationEnabled] = useState<boolean>(false);
  const [amortizationRateHuf, setAmortizationRateHuf] = useState<number>(
    APP_CONFIG.defaultAmortizationRate || 15
  );

  const t = translations[lang];

  // Auto-detect location, fetch live exchange rates, and check fuel price cache on mount
  useEffect(() => {
    handleDetectLocation(true);
    fetchLiveExchangeRates().then((rates) => {
      setExchangeRates(rates);
    });

    // Background 24h fuel price freshness check
    checkAndUpdateFuelPrices(fuelCache).then((res) => {
      if (res.updated) {
        setFuelCache(res.cache);
        setSelectedCountry((prev) =>
          getCountryData(prev.code, res.cache.countries)
        );
      }
    });
  }, []);

  const handleDetectLocation = async (isInitial = false) => {
    setIsDetectingLocation(true);
    if (!isInitial) {
      setLocationStatus(t.detectingLocation);
    }

    try {
      const result = await detectUserCountry();
      const detected = getCountryData(result.countryCode, fuelCache.countries);
      setSelectedCountry(detected);

      if (result.method === 'default') {
        if (!isInitial) {
          setLocationStatus(t.locationFailed);
        }
      } else {
        setLocationStatus(
          `${t.locationDetected}: ${detected.flag} ${lang === 'hu' ? detected.nameHu : detected.nameEn}`
        );
      }
    } catch {
      setSelectedCountry(getCountryData('HU', fuelCache.countries));
      if (!isInitial) setLocationStatus(t.locationFailed);
    } finally {
      setIsDetectingLocation(false);
      // Auto clear location status badge after 5 seconds
      setTimeout(() => setLocationStatus(null), 5000);
    }
  };

  // Compute active price per liter in HUF
  const defaultFuelPriceHuf = selectedCountry.pricesHuf[selectedFuelType] || 618;
  const currentActivePriceHuf = customPriceEnabled && customPrice > 0
    ? customPrice
    : defaultFuelPriceHuf;

  // Compute total effective distance
  const totalEffectiveDistanceKm = isRoundTrip ? distanceKm * 2 : distanceKm;

  // Fuel type label
  const fuelTypeLabels: Record<FuelTypeKey, string> = {
    petrol95: t.petrol95,
    diesel: t.diesel,
    premiumPetrol: t.premiumPetrol,
    premiumDiesel: t.premiumDiesel,
    lpg: t.lpg,
  };

  return (
    <div className="min-h-screen bg-[#0c0e14] text-zinc-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Hero header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{t.badgeLivePrices} &bull; {selectedCountry.flag} {lang === 'hu' ? selectedCountry.nameHu : selectedCountry.nameEn}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t.appTitle}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            {t.appSubtitle}
          </p>
        </div>

        {/* Two-column layout on desktop: Inputs vs Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Trip & Distance Inputs */}
            <TripForm
              lang={lang}
              tripMode={tripMode}
              onTripModeChange={setTripMode}
              fromAddress={fromAddress}
              onFromAddressChange={setFromAddress}
              toAddress={toAddress}
              onToAddressChange={setToAddress}
              distanceKm={distanceKm}
              onDistanceKmChange={setDistanceKm}
              isRoundTrip={isRoundTrip}
              onRoundTripChange={setIsRoundTrip}
              consumptionL100={consumptionL100}
              onConsumptionChange={setConsumptionL100}
              passengerCount={passengerCount}
              onPassengerCountChange={setPassengerCount}
            />

            {/* 2. Fuel & Country Selector */}
            <FuelSelector
              lang={lang}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              selectedFuelType={selectedFuelType}
              onFuelTypeChange={setSelectedFuelType}
              customPriceEnabled={customPriceEnabled}
              onCustomPriceEnabledChange={setCustomPriceEnabled}
              customPrice={customPrice}
              onCustomPriceChange={setCustomPrice}
              currentActivePrice={currentActivePriceHuf}
              currency={currency}
              onDetectLocation={() => handleDetectLocation(false)}
              isDetectingLocation={isDetectingLocation}
              locationStatus={locationStatus}
              lastUpdatedDate={formatLastUpdatedDate(fuelCache.lastUpdatedTimestamp, lang)}
            />

            {/* 3. Amortization Fee Checkbox (+15 Ft/km) */}
            <AmortizationSelector
              lang={lang}
              enabled={amortizationEnabled}
              onEnabledChange={setAmortizationEnabled}
              ratePerKm={amortizationRateHuf}
              onRateChange={setAmortizationRateHuf}
              totalDistanceKm={totalEffectiveDistanceKm}
            />
          </div>

          {/* Right Column: Sticky Cost Summary Card (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            <CostSummary
              lang={lang}
              currency={currency}
              exchangeRates={exchangeRates}
              totalDistanceKm={totalEffectiveDistanceKm}
              consumptionL100={consumptionL100}
              fuelPricePerLiterHuf={currentActivePriceHuf}
              amortizationEnabled={amortizationEnabled}
              amortizationRateHuf={amortizationRateHuf}
              passengerCount={passengerCount}
              isRoundTrip={isRoundTrip}
              selectedFuelLabel={fuelTypeLabels[selectedFuelType]}
              fromAddress={fromAddress}
              toAddress={toAddress}
            />
          </div>
        </div>

        {/* SEO & Usage Guide Section */}
        <InfoGuide lang={lang} />
      </main>

      {/* Footer with Support Section */}
      <Footer lang={lang} />
    </div>
  );
}
