import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  ArrowUpDown,
  Search,
  Clock,
  Gauge,
  Users,
  Repeat,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Car,
  Fuel,
} from 'lucide-react';
import {
  LocationPoint,
  searchAddressSuggestions,
  calculateRouteBetweenAddresses,
  RouteResult,
} from '../services/routingApi.ts';
import { Language, translations } from '../translations.ts';

interface TripFormProps {
  lang: Language;
  tripMode: 'route' | 'direct';
  onTripModeChange: (mode: 'route' | 'direct') => void;
  fromAddress: string;
  onFromAddressChange: (addr: string) => void;
  toAddress: string;
  onToAddressChange: (addr: string) => void;
  distanceKm: number;
  onDistanceKmChange: (distance: number) => void;
  isRoundTrip: boolean;
  onRoundTripChange: (isRound: boolean) => void;
  consumptionL100: number;
  onConsumptionChange: (consumption: number) => void;
  passengerCount: number;
  onPassengerCountChange: (count: number) => void;
}

export const TripForm: React.FC<TripFormProps> = ({
  lang,
  tripMode,
  onTripModeChange,
  fromAddress,
  onFromAddressChange,
  toAddress,
  onToAddressChange,
  distanceKm,
  onDistanceKmChange,
  isRoundTrip,
  onRoundTripChange,
  consumptionL100,
  onConsumptionChange,
  passengerCount,
  onPassengerCountChange,
}) => {
  const t = translations[lang];

  // Route state
  const [fromSuggestions, setFromSuggestions] = useState<LocationPoint[]>([]);
  const [toSuggestions, setToSuggestions] = useState<LocationPoint[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [isSearchingFromSuggestions, setIsSearchingFromSuggestions] = useState(false);
  const [isSearchingToSuggestions, setIsSearchingToSuggestions] = useState(false);

  const [isSearchingRoute, setIsSearchingRoute] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteResult | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Wrapper refs for closing dropdown on outside click
  const fromWrapperRef = useRef<HTMLDivElement>(null);
  const toWrapperRef = useRef<HTMLDivElement>(null);

  // Address search debounce refs
  const fromDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromWrapperRef.current && !fromWrapperRef.current.contains(event.target as Node)) {
        setShowFromSuggestions((prev) => (prev ? false : prev));
      }
      if (toWrapperRef.current && !toWrapperRef.current.contains(event.target as Node)) {
        setShowToSuggestions((prev) => (prev ? false : prev));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFromInput = (val: string) => {
    onFromAddressChange(val);
    if (fromDebounceRef.current) clearTimeout(fromDebounceRef.current);
    if (val.trim().length >= 2) {
      setShowFromSuggestions(true);
      setIsSearchingFromSuggestions(true);
      fromDebounceRef.current = setTimeout(async () => {
        try {
          const results = await searchAddressSuggestions(val);
          setFromSuggestions(results);
        } catch {
          setFromSuggestions([]);
        } finally {
          setIsSearchingFromSuggestions(false);
        }
      }, 280);
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
      setIsSearchingFromSuggestions(false);
    }
  };

  const handleToInput = (val: string) => {
    onToAddressChange(val);
    if (toDebounceRef.current) clearTimeout(toDebounceRef.current);
    if (val.trim().length >= 2) {
      setShowToSuggestions(true);
      setIsSearchingToSuggestions(true);
      toDebounceRef.current = setTimeout(async () => {
        try {
          const results = await searchAddressSuggestions(val);
          setToSuggestions(results);
        } catch {
          setToSuggestions([]);
        } finally {
          setIsSearchingToSuggestions(false);
        }
      }, 280);
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
      setIsSearchingToSuggestions(false);
    }
  };

  const handleSwapAddresses = () => {
    const currentFrom = fromAddress;
    const currentTo = toAddress;
    onFromAddressChange(currentTo);
    onToAddressChange(currentFrom);
    setFromSuggestions([]);
    setToSuggestions([]);
  };

  const handleCalculateRoute = async () => {
    if (!fromAddress.trim() || !toAddress.trim()) {
      setRouteError(lang === 'hu' ? 'Kérjük, mindkét címet add meg!' : 'Please provide both addresses!');
      return;
    }

    setIsSearchingRoute(true);
    setRouteError(null);

    try {
      const res = await calculateRouteBetweenAddresses(fromAddress, toAddress);
      if (res) {
        setRouteInfo(res);
        onDistanceKmChange(res.distanceKm);
      } else {
        setRouteError(t.routeNotFound);
      }
    } catch {
      setRouteError(t.routeNotFound);
    } finally {
      setIsSearchingRoute(false);
    }
  };

  // Consumption presets
  const consumptionPresets = [
    { label: lang === 'hu' ? 'Takarékos dízel' : 'Eco Diesel', val: 4.8 },
    { label: lang === 'hu' ? 'Átlagos benzines' : 'Standard Petrol', val: 6.5 },
    { label: lang === 'hu' ? 'Városi / SUV' : 'City / SUV', val: 8.5 },
    { label: lang === 'hu' ? 'Nagyobb motor' : 'Large Engine', val: 10.5 },
  ];

  // Quick distance chips for direct distance mode
  const distanceChips = [25, 50, 100, 150, 250, 500];

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xs space-y-6">
      {/* Mode Switcher Tabs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-emerald-400">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-100 text-sm sm:text-base">
                {lang === 'hu' ? 'Út és Fogyasztás Adatai' : 'Trip & Consumption Details'}
              </h2>
              <p className="text-xs text-zinc-400">
                {lang === 'hu' ? 'Távolság meghatározása és fogyasztás' : 'Define distance and fuel consumption'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
          <button
            type="button"
            onClick={() => onTripModeChange('direct')}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
              tripMode === 'direct'
                ? 'bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.directDistance}</span>
          </button>
          <button
            type="button"
            onClick={() => onTripModeChange('route')}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
              tripMode === 'route'
                ? 'bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.tripPlanner}</span>
          </button>
        </div>
      </div>

      {/* MODE 1: Two Addresses Route Planner */}
      {tripMode === 'route' && (
        <div className="space-y-3.5">
          {/* Origin Address */}
          <div ref={fromWrapperRef} className="relative">
            <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {t.fromAddress}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={fromAddress}
                onChange={(e) => handleFromInput(e.target.value)}
                onFocus={() => {
                  if (fromAddress.trim().length >= 2) {
                    setShowFromSuggestions(true);
                  }
                }}
                placeholder={t.fromPlaceholder}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2.5 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>

            {/* Suggestions dropdown with immediate loading spinner */}
            {showFromSuggestions && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden max-h-52 overflow-y-auto">
                {isSearchingFromSuggestions ? (
                  <div className="p-4 flex items-center justify-center gap-2.5 text-xs text-zinc-400">
                    <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>{t.searchingAddresses}</span>
                  </div>
                ) : fromSuggestions.length > 0 ? (
                  fromSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onFromAddressChange(s.displayName);
                        setShowFromSuggestions(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs text-zinc-200 hover:bg-zinc-800 hover:text-emerald-400 border-b border-zinc-800/60 last:border-0 truncate flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{s.displayName}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-zinc-500">
                    {t.noAddressFound}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-1">
            <button
              type="button"
              onClick={handleSwapAddresses}
              className="p-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-all shadow-xs"
              title={t.swapAddresses}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Destination Address */}
          <div ref={toWrapperRef} className="relative">
            <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                {t.toAddress}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={toAddress}
                onChange={(e) => handleToInput(e.target.value)}
                onFocus={() => {
                  if (toAddress.trim().length >= 2) {
                    setShowToSuggestions(true);
                  }
                }}
                placeholder={t.toPlaceholder}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2.5 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>

            {/* Suggestions dropdown with immediate loading spinner */}
            {showToSuggestions && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden max-h-52 overflow-y-auto">
                {isSearchingToSuggestions ? (
                  <div className="p-4 flex items-center justify-center gap-2.5 text-xs text-zinc-400">
                    <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>{t.searchingAddresses}</span>
                  </div>
                ) : toSuggestions.length > 0 ? (
                  toSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onToAddressChange(s.displayName);
                        setShowToSuggestions(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs text-zinc-200 hover:bg-zinc-800 hover:text-emerald-400 border-b border-zinc-800/60 last:border-0 truncate flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{s.displayName}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-zinc-500">
                    {t.noAddressFound}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Calculate button */}
          <button
            type="button"
            onClick={handleCalculateRoute}
            disabled={isSearchingRoute || !fromAddress || !toAddress}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSearchingRoute ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.calculatingRoute}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>{t.calculateRouteBtn}</span>
              </>
            )}
          </button>

          {/* Route Error message */}
          {routeError && (
            <div className="text-xs text-red-400 bg-red-950/30 border border-red-800/40 p-2.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{routeError}</span>
            </div>
          )}

          {/* Route Calculated Card */}
          {routeInfo && (
            <div className="p-3 bg-zinc-950/80 border border-emerald-500/30 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {t.routeFound}
                </span>
                <span className="text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                  {routeInfo.source === 'osrm_free' ? 'OSRM (OpenStreetMap) Free' : 'Distance Matrix'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/60 font-mono-num">
                <div className="flex items-center gap-1.5 text-zinc-200">
                  <Car className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-zinc-400">{t.distanceLabel}:</span>
                  <span className="font-bold text-zinc-100">{routeInfo.distanceKm} km</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-200">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-zinc-400">{t.durationLabel}:</span>
                  <span className="font-bold text-zinc-100">
                    {Math.floor(routeInfo.durationMinutes / 60) > 0
                      ? `${Math.floor(routeInfo.durationMinutes / 60)}ó `
                      : ''}
                    {routeInfo.durationMinutes % 60}p
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: Direct Distance Input */}
      {tripMode === 'direct' && (
        <div className="space-y-3">
          <label className="block text-xs font-medium text-zinc-400">
            {lang === 'hu' ? 'Út hossza (egy irányba)' : 'Trip Distance (one-way)'}
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="1"
              value={distanceKm || ''}
              onChange={(e) => onDistanceKmChange(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="Pl. 140"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm font-mono-num text-zinc-100 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-mono-num text-zinc-400">
              km
            </span>
          </div>

          {/* Quick distance presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {distanceChips.map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => onDistanceKmChange(km)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-mono-num transition-all ${
                  distanceKm === km
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {km} km
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Round Trip Toggle */}
      <div className="pt-2 border-t border-zinc-800/60">
        <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition-all select-none">
          <div className="flex items-center gap-2.5">
            <Repeat className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs sm:text-sm font-medium text-zinc-200 block">
                {t.roundTrip}
              </span>
              <span className="text-[11px] text-zinc-400 block">
                {t.roundTripNotice}
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isRoundTrip}
            onChange={(e) => onRoundTripChange(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900 accent-emerald-500 cursor-pointer"
          />
        </label>
      </div>

      {/* Average Consumption Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.averageConsumption}</span>
          </label>
          <span className="text-[11px] text-zinc-400 font-mono-num">
            {t.consumptionUnit}
          </span>
        </div>
        <div className="relative">
          <input
            type="number"
            min="0.1"
            max="40"
            step="0.1"
            value={consumptionL100 || ''}
            onChange={(e) => onConsumptionChange(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono-num text-zinc-100 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <span className="absolute right-3.5 top-2.5 text-xs font-mono-num text-zinc-400">
            L / 100km
          </span>
        </div>

        {/* Consumption Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
          {consumptionPresets.map((p) => (
            <button
              key={p.val}
              type="button"
              onClick={() => onConsumptionChange(p.val)}
              className={`text-[11px] p-1.5 rounded-lg border text-center transition-all ${
                consumptionL100 === p.val
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="font-mono-num font-semibold">{p.val} L</div>
              <div className="text-[10px] text-zinc-400 truncate">{p.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Passenger Split (Utasok száma) */}
      <div className="pt-2 border-t border-zinc-800/60">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.passengers}</span>
          </label>
          <span className="text-xs font-mono-num text-emerald-400 font-semibold">
            {passengerCount} {t.perPerson}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onPassengerCountChange(num)}
              className={`flex-1 py-1.5 rounded-lg border text-xs font-mono-num font-medium transition-all ${
                passengerCount === num
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
