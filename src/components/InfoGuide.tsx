import React from 'react';
import { Route, Fuel, Wrench, Users, HelpCircle } from 'lucide-react';
import { Language } from '../translations.ts';

interface InfoGuideProps {
  lang: Language;
}

export const InfoGuide: React.FC<InfoGuideProps> = ({ lang }) => {
  const isHu = lang === 'hu';

  return (
    <section aria-labelledby="how-it-works-title" className="mt-14 pt-10 border-t border-zinc-800/70 text-zinc-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <HelpCircle className="w-4 h-4" />
        </div>
        <h2 id="how-it-works-title" className="text-base sm:text-lg font-semibold text-zinc-100">
          {isHu ? 'Hogyan működik az üzemanyag kalkulátor?' : 'How does the fuel calculator work?'}
        </h2>
      </div>

      <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed mb-6">
        {isHu
          ? 'Az eszköz célja, hogy gyorsan és pontosan egy helyen kiszámolja az autóutak teljes üzemanyag- és járulékos költségét különböző utazásokhoz.'
          : 'This tool is designed to quickly and accurately calculate the complete fuel and vehicle expenses for various road trips in one place.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Route */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <Route className="w-4 h-4" />
            <span>{isHu ? '1. Útvonal & Távolság' : '1. Route & Distance'}</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {isHu
              ? 'Add meg az indulási és érkezési címet az automatikus útvonaltervezéshez, vagy írd be közvetlenül a kilométert oda-vissza opcióval.'
              : 'Enter origin and destination addresses for automatic route calculation, or type the exact distance directly with round-trip support.'}
          </p>
        </div>

        {/* Card 2: Fuel */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
            <Fuel className="w-4 h-4" />
            <span>{isHu ? '2. Árak és Fogyasztás' : '2. Prices & Consumption'}</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {isHu
              ? 'Számolj 16 ország aktuális átlagáraival (95-ös benzin, dízel, prémium, LPG) vagy add meg a saját kútad pontos literenkénti árát.'
              : 'Calculate with real-time average fuel prices across 16 countries or enter your exact local fuel station price per liter.'}
          </p>
        </div>

        {/* Card 3: Amortization */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
            <Wrench className="w-4 h-4" />
            <span>{isHu ? '3. Amortizáció (+15 Ft/km)' : '3. Amortization Allowance'}</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {isHu
              ? 'Opcionálisan bevonhatod a NAV által elismert 15 Ft/km elhasználódási és szervizdíjat, így a jármű kopása is megtérül.'
              : 'Optionally include standard vehicle wear, maintenance, and depreciation rates (default 15 HUF/km) in the calculation.'}
          </p>
        </div>

        {/* Card 4: Passenger split */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
            <Users className="w-4 h-4" />
            <span>{isHu ? '4. Költségmegosztás' : '4. Cost Splitting'}</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {isHu
              ? 'Többen utaztok? Állítsd be az utasok számát (1-8 fő), és másold ki az átlátható útiköltség-összesítőt egyetlen kattintással.'
              : 'Traveling together? Set the passenger count (1-8 people) and copy the formatted trip summary with a single click.'}
          </p>
        </div>
      </div>
    </section>
  );
};
