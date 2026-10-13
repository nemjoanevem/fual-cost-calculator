import React from 'react';
import { Wrench, Info, Check } from 'lucide-react';
import { Language, translations } from '../translations.ts';

interface AmortizationSelectorProps {
  lang: Language;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  ratePerKm: number;
  onRateChange: (rate: number) => void;
  totalDistanceKm: number;
}

export const AmortizationSelector: React.FC<AmortizationSelectorProps> = ({
  lang,
  enabled,
  onEnabledChange,
  ratePerKm,
  onRateChange,
  totalDistanceKm,
}) => {
  const t = translations[lang];
  const calculatedTotalAmortization = Math.round(totalDistanceKm * ratePerKm);

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
      enabled
        ? 'bg-emerald-950/20 border-emerald-500/50'
        : 'bg-zinc-900/60 border-zinc-800/80'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900 accent-emerald-500 cursor-pointer"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm sm:text-base text-zinc-100">
                {t.amortizationLabel}
              </span>
              <span className="text-xs font-mono-num font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                +{ratePerKm} Ft / km
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-lg">
              {t.amortizationDesc}
            </p>
          </div>
        </label>

        {enabled && (
          <div className="text-right shrink-0">
            <span className="text-[11px] text-zinc-400 block font-mono-num">
              {lang === 'hu' ? 'Amortizációs összeg:' : 'Depreciation total:'}
            </span>
            <span className="text-sm sm:text-base font-bold font-mono-num text-emerald-400">
              +{calculatedTotalAmortization.toLocaleString('hu-HU')} Ft
            </span>
          </div>
        )}
      </div>

      {enabled && (
        <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-zinc-500" />
            {lang === 'hu' ? 'Alapértelmezett NAV norma: 15 Ft/km' : 'Standard allowance rate: 15 HUF/km'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px]">{lang === 'hu' ? 'Mérték:' : 'Rate:'}</span>
            <input
              type="number"
              min="0"
              step="1"
              value={ratePerKm}
              onChange={(e) => onRateChange(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-16 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-xs font-mono-num text-right text-zinc-200 focus:outline-hidden focus:border-emerald-500"
            />
            <span className="text-[11px] font-mono-num">Ft/km</span>
          </div>
        </div>
      )}
    </div>
  );
};
