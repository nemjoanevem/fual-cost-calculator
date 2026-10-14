import React from 'react';
import { Coffee, ShieldCheck } from 'lucide-react';
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
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 mb-8 flex items-center justify-start">
          <a
            href={APP_CONFIG.kofiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3.5 px-5 py-3 rounded-xl bg-[#FF5E5B] hover:bg-[#ff4642] text-white shadow-lg shadow-[#FF5E5B]/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-sm sm:text-base leading-tight">
                {t.kofiTitle}
              </span>
              <span className="block text-xs text-white/90 mt-0.5 font-normal">
                {t.kofiTooltip}
              </span>
            </div>
          </a>
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
