import React, { useState } from 'react';
import { X, Code, Key, Coffee, ShieldCheck, Check, Copy, ExternalLink } from 'lucide-react';
import { APP_CONFIG } from '../config.ts';
import { Language } from '../translations.ts';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, lang }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyConfigPath = () => {
    navigator.clipboard.writeText('src/config.ts');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100 text-base">
              {lang === 'hu' ? 'Beállítások & API Konfiguráció' : 'Settings & API Configuration'}
            </h3>
            <p className="text-xs text-zinc-400">
              {lang === 'hu' ? 'A projekt testreszabása és kulcsok kezelése' : 'Customize project and API keys'}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-zinc-300">
          {/* Config file location */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-200">
                {lang === 'hu' ? 'Központi konfigurációs fájl:' : 'Central config file:'}
              </span>
              <button
                type="button"
                onClick={handleCopyConfigPath}
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? (lang === 'hu' ? 'Másolva' : 'Copied') : 'src/config.ts'}</span>
              </button>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              {lang === 'hu'
                ? 'Minden saját API kulcsot, a Ko-fi profil linket és az alapértelmezett értékeket közvetlenül a `src/config.ts` fájlban tudod átírni.'
                : 'You can customize all API keys, your personal Ko-fi profile link, and defaults directly inside `src/config.ts`.'}
            </p>
          </div>

          {/* Donation section */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-zinc-200">
              <Coffee className="w-4 h-4 text-[#FF5E5B]" />
              <span>{lang === 'hu' ? 'Támogatási Profil Link' : 'Donation Profile Link'}</span>
            </div>
            <p className="text-zinc-400">
              {lang === 'hu' ? 'Jelenlegi beállított link:' : 'Current configured link:'}
            </p>
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 font-mono-num text-emerald-400 break-all select-all">
              {APP_CONFIG.kofiUrl}
            </div>
          </div>

          {/* Free Routing explanation */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-zinc-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'hu' ? '100% Ingyenes Útvonalszámítás (OSRM)' : '100% Free Routing (OSRM)'}</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              {lang === 'hu'
                ? 'Az alkalmazás alapértelmezetten a nyílt forráskódú OpenStreetMap és OSRM szolgáltatást használja. Ez teljesen díjmentes, nem kér bankkártyát és nincs semmilyen fizetési kockázat!'
                : 'The app uses open-source OpenStreetMap and OSRM by default. It is 100% free, requires no credit card, and has zero billing risk.'}
            </p>
          </div>

          {/* Optional Google Maps */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-zinc-200">
              <Key className="w-4 h-4 text-amber-400" />
              <span>{lang === 'hu' ? 'Google Maps API (Opcionális)' : 'Google Maps API (Optional)'}</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              {lang === 'hu'
                ? 'Ha mégis a Google Maps szolgáltatását szeretnéd használni, a `src/config.ts` fájlban beállíthatod a kulcsodat (`googleMapsApiKey`), beépített híváslimittel, amely megelőzi a fizetős keret elérését.'
                : 'If you prefer Google Maps, you can provide your `googleMapsApiKey` in `src/config.ts` with a built-in session limiter that prevents accidental billing.'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer"
          >
            {lang === 'hu' ? 'Bezárás' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
