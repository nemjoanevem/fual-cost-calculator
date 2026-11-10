import React from 'react';
import { Fuel, Globe } from 'lucide-react';
import { Language, translations } from '../translations.ts';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currency: 'HUF' | 'EUR' | 'USD';
  onCurrencyChange: (curr: 'HUF' | 'EUR' | 'USD') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  currency,
  onCurrencyChange,
}) => {
  const t = translations[lang];

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40 w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
            <Fuel className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-zinc-100 tracking-tight text-sm sm:text-lg block truncate">
              {t.appTitle}
            </span>
            <p className="text-xs text-zinc-400 hidden sm:block truncate">
              {lang === 'hu' ? 'Minimalista útiköltség-számoló' : 'Minimalist trip cost calculator'}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Currency Selector */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
            {(['HUF', 'EUR', 'USD'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCurrencyChange(c)}
                className={`px-1.5 sm:px-2 py-1 rounded-md font-mono-num font-medium text-[11px] sm:text-xs transition-all ${
                  currency === c
                    ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => onLanguageChange('hu')}
              className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-md font-medium text-[11px] sm:text-xs transition-all ${
                lang === 'hu'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Magyar nyelv"
            >
              <span>🇭🇺</span>
              <span className="hidden xs:inline sm:inline">HU</span>
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-md font-medium text-[11px] sm:text-xs transition-all ${
                lang === 'en'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="English language"
            >
              <span>🇬🇧</span>
              <span className="hidden xs:inline sm:inline">EN</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
