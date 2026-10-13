import React, { useState, useRef, useEffect } from 'react';
import { Fuel, MapPin, Check, Edit3, RotateCw, Info, ChevronDown, Search } from 'lucide-react';
import { COUNTRIES, CountryFuelData, FuelTypeKey } from '../services/fuelApi.ts';
import { Language, translations } from '../translations.ts';

interface FuelSelectorProps {
  lang: Language;
  selectedCountry: CountryFuelData;
  onCountryChange: (country: CountryFuelData) => void;
  selectedFuelType: FuelTypeKey;
  onFuelTypeChange: (fuelType: FuelTypeKey) => void;
  customPriceEnabled: boolean;
  onCustomPriceEnabledChange: (enabled: boolean) => void;
  customPrice: number;
  onCustomPriceChange: (price: number) => void;
  currentActivePrice: number;
  currency: 'HUF' | 'EUR' | 'USD';
  onDetectLocation: () => void;
  isDetectingLocation: boolean;
  locationStatus: string | null;
}

export const FuelSelector: React.FC<FuelSelectorProps> = ({
  lang,
  selectedCountry,
  onCountryChange,
  selectedFuelType,
  onFuelTypeChange,
  customPriceEnabled,
  onCustomPriceEnabledChange,
  customPrice,
  onCustomPriceChange,
  currentActivePrice,
  currency,
  onDetectLocation,
  isDetectingLocation,
  locationStatus,
}) => {
  const t = translations[lang];

  // Custom country dropdown state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isCountryDropdownOpen]);

  const filteredCountries = COUNTRIES.filter((c) => {
    const q = countrySearchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (lang === 'hu' ? c.nameHu : c.nameEn).toLowerCase();
    return name.includes(q) || c.code.toLowerCase().includes(q) || c.currency.toLowerCase().includes(q);
  });

  const fuelOptions: { key: FuelTypeKey; label: string; iconLabel: string }[] = [
    { key: 'petrol95', label: t.petrol95, iconLabel: '95' },
    { key: 'diesel', label: t.diesel, iconLabel: 'D' },
    { key: 'premiumPetrol', label: t.premiumPetrol, iconLabel: '100+' },
    { key: 'premiumDiesel', label: t.premiumDiesel, iconLabel: 'D+' },
    { key: 'lpg', label: t.lpg, iconLabel: 'LPG' },
  ];

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-emerald-400">
            <Fuel className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-zinc-100 text-sm sm:text-base">
              {t.fuelPrice} & {t.countrySelect}
            </h2>
            <p className="text-xs text-zinc-400">
              {t.badgeLivePrices} ({selectedCountry.flag} {lang === 'hu' ? selectedCountry.nameHu : selectedCountry.nameEn})
            </p>
          </div>
        </div>

        {/* Location detect button */}
        <button
          type="button"
          onClick={onDetectLocation}
          disabled={isDetectingLocation}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 bg-zinc-800/60 hover:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-zinc-700/50 transition-all disabled:opacity-50 cursor-pointer"
          title={t.detectingLocation}
        >
          {isDetectingLocation ? (
            <RotateCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          ) : (
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className="hidden sm:inline">
            {isDetectingLocation ? t.detectingLocation : (lang === 'hu' ? 'Helyzetem' : 'My location')}
          </span>
        </button>
      </div>

      {locationStatus && (
        <div className="mb-4 text-xs text-emerald-400/90 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>{locationStatus}</span>
        </div>
      )}

      {/* Robust Custom Country Selection Dropdown */}
      <div ref={countryDropdownRef} className="relative mb-4">
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
          {t.countrySelect}
        </label>
        <button
          type="button"
          onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
          className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 flex items-center justify-between transition-all cursor-pointer focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base leading-none">{selectedCountry.flag}</span>
            <span className="font-medium text-zinc-100">
              {lang === 'hu' ? selectedCountry.nameHu : selectedCountry.nameEn}
            </span>
            <span className="text-xs font-mono-num text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
              {selectedCountry.currency}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
              isCountryDropdownOpen ? 'rotate-180 text-emerald-400' : ''
            }`}
          />
        </button>

        {isCountryDropdownOpen && (
          <div className="absolute z-40 left-0 right-0 mt-1.5 bg-zinc-900/98 backdrop-blur-md border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden max-h-64 flex flex-col">
            {/* Quick search input */}
            <div className="p-2 border-b border-zinc-800 sticky top-0 bg-zinc-900/95 z-10">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={countrySearchQuery}
                  onChange={(e) => setCountrySearchQuery(e.target.value)}
                  placeholder={lang === 'hu' ? 'Ország keresése...' : 'Search country...'}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-hidden focus:border-emerald-500"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2" />
              </div>
            </div>

            {/* Scrollable list of countries */}
            <div className="overflow-y-auto max-h-52 divide-y divide-zinc-800/40">
              {filteredCountries.map((c) => {
                const isSelected = c.code === selectedCountry.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onCountryChange(c);
                      setIsCountryDropdownOpen(false);
                      setCountrySearchQuery('');
                    }}
                    className={`w-full px-3.5 py-2.5 text-xs flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/40 text-emerald-300 font-semibold'
                        : 'text-zinc-200 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{c.flag}</span>
                      <span>{lang === 'hu' ? c.nameHu : c.nameEn}</span>
                      <span className="text-[11px] font-mono-num text-zinc-400">
                        ({c.currency})
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fuel Type selection */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-zinc-400 mb-2">
          {t.fuelType}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {fuelOptions.map((opt) => {
            const isSelected = selectedFuelType === opt.key;
            const price = selectedCountry.pricesHuf[opt.key];
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onFuelTypeChange(opt.key)}
                className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 text-zinc-100 shadow-sm'
                    : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <span className="text-xs font-semibold tracking-wide mb-0.5">
                  {opt.label}
                </span>
                <span className="font-mono-num text-[11px] text-zinc-400">
                  ~{price} Ft/l
                </span>
                {isSelected && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fuel Price Display & Custom Price Toggle */}
      <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Toggle Custom Price */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={customPriceEnabled}
            onChange={(e) => onCustomPriceEnabledChange(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900 accent-emerald-500 cursor-pointer"
          />
          <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
            {t.customFuelPrice}
          </span>
        </label>

        {/* Current price or Custom input */}
        <div className="flex items-center gap-2">
          {customPriceEnabled ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                step="1"
                value={customPrice || ''}
                onChange={(e) => onCustomPriceChange(parseFloat(e.target.value) || 0)}
                placeholder={t.customPricePlaceholder}
                className="w-28 bg-zinc-950 border border-emerald-500/60 rounded-lg px-2.5 py-1.5 text-sm font-mono-num font-semibold text-emerald-300 focus:outline-hidden focus:border-emerald-400"
              />
              <span className="text-xs font-medium text-zinc-400 font-mono-num">
                Ft / liter
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
              <span className="text-xs text-zinc-400">{lang === 'hu' ? 'Aktuális átlagár:' : 'Average price:'}</span>
              <span className="text-sm font-bold font-mono-num text-emerald-400">
                {currentActivePrice}
              </span>
              <span className="text-xs text-zinc-400 font-mono-num">Ft / liter</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
