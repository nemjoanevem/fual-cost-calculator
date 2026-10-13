import React, { useState } from 'react';
import {
  Calculator,
  Copy,
  Check,
  Share2,
  Users,
  Fuel,
  Wrench,
  Navigation,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Language, translations } from '../translations.ts';

import { ExchangeRates } from '../services/currencyApi.ts';

interface CostSummaryProps {
  lang: Language;
  currency: 'HUF' | 'EUR' | 'USD';
  exchangeRates: ExchangeRates;
  totalDistanceKm: number;
  consumptionL100: number;
  fuelPricePerLiterHuf: number;
  amortizationEnabled: boolean;
  amortizationRateHuf: number;
  passengerCount: number;
  isRoundTrip: boolean;
  selectedFuelLabel: string;
}

export const CostSummary: React.FC<CostSummaryProps> = ({
  lang,
  currency,
  exchangeRates,
  totalDistanceKm,
  consumptionL100,
  fuelPricePerLiterHuf,
  amortizationEnabled,
  amortizationRateHuf,
  passengerCount,
  isRoundTrip,
  selectedFuelLabel,
}) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  const convert = (valHuf: number) => {
    if (currency === 'HUF') {
      return `${Math.round(valHuf).toLocaleString('hu-HU')} Ft`;
    }
    const rate = currency === 'EUR' ? exchangeRates.EUR : exchangeRates.USD;
    const converted = rate > 0 ? valHuf / rate : valHuf / 400;
    return `${currency === 'EUR' ? '€' : '$'}${converted.toFixed(2)}`;
  };

  // Math
  const totalLiters = (totalDistanceKm * consumptionL100) / 100;
  const fuelCostHuf = totalLiters * fuelPricePerLiterHuf;
  const amortizationCostHuf = amortizationEnabled ? totalDistanceKm * amortizationRateHuf : 0;
  const totalCostHuf = fuelCostHuf + amortizationCostHuf;

  const costPerPersonHuf = passengerCount > 0 ? totalCostHuf / passengerCount : totalCostHuf;
  const costPerKmHuf = totalDistanceKm > 0 ? totalCostHuf / totalDistanceKm : 0;

  const fuelPercent = totalCostHuf > 0 ? Math.round((fuelCostHuf / totalCostHuf) * 100) : 100;
  const amortPercent = 100 - fuelPercent;

  const handleCopySummary = async () => {
    const summaryText = `🚗 ${t.appTitle}
----------------------------------
📍 ${t.distanceLabel}: ${totalDistanceKm} km ${isRoundTrip ? `(${t.roundTrip})` : ''}
⛽ ${t.fuelType}: ${selectedFuelLabel} (${Math.round(fuelPricePerLiterHuf)} Ft/l)
📊 ${t.averageConsumption}: ${consumptionL100} L/100km
🛢️ ${t.fuelNeeded}: ${totalLiters.toFixed(1)} L
💰 ${t.fuelCostOnly}: ${Math.round(fuelCostHuf).toLocaleString('hu-HU')} Ft
${amortizationEnabled ? `🔧 ${t.amortizationCostOnly}: ${Math.round(amortizationCostHuf).toLocaleString('hu-HU')} Ft (${amortizationRateHuf} Ft/km)\n` : ''}----------------------------------
⭐ ${t.totalCost}: ${Math.round(totalCostHuf).toLocaleString('hu-HU')} Ft
${passengerCount > 1 ? `👥 ${t.splitCost} (${passengerCount} ${t.perPerson}): ${Math.round(costPerPersonHuf).toLocaleString('hu-HU')} Ft / ${t.perPerson}\n` : ''}📈 ${t.costPerKm}: ${costPerKmHuf.toFixed(1)} Ft/km
`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Calculator className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-zinc-100 text-base">
            {t.summaryTitle}
          </h3>
        </div>

        {/* Copy summary button */}
        <button
          type="button"
          onClick={handleCopySummary}
          className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/70 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">{t.summaryCopied}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.copySummary}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Big Result */}
      <div className="mb-6 pb-6 border-b border-zinc-800/80 relative z-10">
        <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
          {t.totalCost}
        </span>
        <div className="flex items-baseline gap-3 flex-wrap">
          <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono-num tracking-tight text-white">
            {convert(totalCostHuf)}
          </div>
          {currency !== 'HUF' && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-mono-num text-zinc-400">
                (~{Math.round(totalCostHuf).toLocaleString('hu-HU')} Ft)
              </span>
              <span className="text-[11px] font-mono-num text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                1 {currency} = {(currency === 'EUR' ? exchangeRates.EUR : exchangeRates.USD).toFixed(1)} Ft
                <span className="text-zinc-400">({lang === 'hu' ? 'Élő banki árfolyam' : 'Live FX rate'})</span>
              </span>
            </div>
          )}
        </div>

        {/* Per passenger split if > 1 */}
        {passengerCount > 1 && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm">
            <Users className="w-4 h-4" />
            <span className="text-zinc-300">{t.splitCost}:</span>
            <span className="font-bold font-mono-num text-emerald-400">
              {convert(costPerPersonHuf)} / {t.perPerson}
            </span>
          </div>
        )}
      </div>

      {/* Visual Breakdown Progress Bar */}
      {amortizationEnabled && totalCostHuf > 0 && (
        <div className="mb-6 space-y-2 relative z-10">
          <div className="flex justify-between text-xs text-zinc-400 font-medium">
            <span>{t.costBreakdown}</span>
            <span className="font-mono-num">
              ⛽ {fuelPercent}% &nbsp;|&nbsp; 🔧 {amortPercent}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden flex border border-zinc-800">
            <div
              style={{ width: `${fuelPercent}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`${t.fuelCostOnly}: ${fuelPercent}%`}
            />
            <div
              style={{ width: `${amortPercent}%` }}
              className="bg-amber-500/80 transition-all duration-500"
              title={`${t.amortizationCostOnly}: ${amortPercent}%`}
            />
          </div>
        </div>
      )}

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2.5 sm:gap-3 relative z-10">
        {/* Metric: Fuel Cost */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs min-w-0">
            <Fuel className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{t.fuelCostOnly}</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono-num text-zinc-100 whitespace-nowrap overflow-hidden text-ellipsis">
            {convert(fuelCostHuf)}
          </div>
        </div>

        {/* Metric: Amortization Cost */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs min-w-0">
            <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{t.amortizationCostOnly}</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono-num text-zinc-100 whitespace-nowrap overflow-hidden text-ellipsis">
            {amortizationEnabled ? convert(amortizationCostHuf) : '0 Ft'}
          </div>
        </div>

        {/* Metric: Fuel Needed */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs min-w-0">
            <Fuel className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="truncate">{t.fuelNeeded}</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono-num text-zinc-100 whitespace-nowrap overflow-hidden text-ellipsis">
            {totalLiters.toFixed(1)} L
          </div>
        </div>

        {/* Metric: Total Distance */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs min-w-0">
            <Navigation className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{t.distanceLabel}</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono-num text-zinc-100 whitespace-nowrap overflow-hidden text-ellipsis">
            {totalDistanceKm} km
          </div>
        </div>

        {/* Metric: Cost per km */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs min-w-0">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{t.costPerKm}</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono-num text-zinc-100 whitespace-nowrap overflow-hidden text-ellipsis">
            {costPerKmHuf.toFixed(1)} Ft / km
          </div>
        </div>

        {/* Metric: Consumption */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs min-w-0">
            <Navigation className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span className="truncate">{t.averageConsumption}</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono-num text-zinc-100 whitespace-nowrap overflow-hidden text-ellipsis">
            {consumptionL100} L / 100km
          </div>
        </div>
      </div>
    </div>
  );
};
