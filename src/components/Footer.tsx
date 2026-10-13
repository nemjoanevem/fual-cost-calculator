import React from 'react';
import { Coffee, Heart, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '../config.ts';
import { Language, translations } from '../translations.ts';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md mt-16 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Support Section */}
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 mb-8 flex flex-col sm:flex-row items-center justify-start gap-4 sm:gap-6">
          {/* Button on the left */}
          <a
            href={APP_CONFIG.kofiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-[#FF5E5B] hover:bg-[#ff4642] text-white shadow-lg shadow-[#FF5E5B]/20 transition-all hover:scale-102 active:scale-98 shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-white fill-white group-hover:scale-115 transition-transform" />
            <span>{t.kofiButtonText}</span>
          </a>

          {/* Text beside the button */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-zinc-100 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
              <Coffee className="w-4 h-4 text-[#FF5E5B] shrink-0" />
              <span>{t.kofiTitle}</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              {t.kofiTooltip}
            </p>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {t.freeRoutingNotice}
            </span>
          </div>

          <div className="flex items-center gap-2 text-zinc-400">
            <span>
              {lang === 'hu' ? 'Üzemanyag Kalkulátor' : 'Fuel Cost Calculator'} &copy; {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
