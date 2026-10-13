import React from 'react';
import { Fuel, Globe, Settings, Sparkles } from 'lucide-react';
import { Language, translations } from '../translations.ts';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currency: 'HUF' | 'EUR' | 'USD';
  onCurrencyChange: (curr: 'HUF' | 'EUR' | 'USD') => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  currency,
  onCurrencyChange,
  onOpenSettings,
}) => {
  const t = translations[lang];

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-zinc-100 tracking-tight text-base sm:text-lg">
                {t.appTitle}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                <Sparkles className="w-2.5 h-2.5" /> Free API
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              {lang === 'hu' ? 'Minimalista útiköltség-számoló' : 'Minimalist trip cost calculator'}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Currency Selector */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
            {(['HUF', 'EUR', 'USD'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCurrencyChange(c)}
                className={`px-2 py-1 rounded-md font-mono-num font-medium transition-all ${
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                lang === 'hu'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Magyar nyelv"
            >
              <span>🇭🇺</span>
              <span>HU</span>
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                lang === 'en'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="English language"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          {/* Config / Info button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-all"
            title={lang === 'hu' ? 'Beállítások & API Config' : 'Settings & API Config'}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
