export type Language = 'hu' | 'en';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  badgeLivePrices: string;
  
  // Tabs / Navigation
  tripPlanner: string;
  directDistance: string;
  
  // Trip planning
  fromAddress: string;
  toAddress: string;
  fromPlaceholder: string;
  toPlaceholder: string;
  swapAddresses: string;
  calculatingRoute: string;
  calculateRouteBtn: string;
  routeNotFound: string;
  routeFound: string;
  distanceLabel: string;
  durationLabel: string;
  roundTrip: string;
  roundTripNotice: string;
  
  // Fuel & Consumption
  fuelType: string;
  petrol95: string;
  diesel: string;
  premiumPetrol: string;
  premiumDiesel: string;
  lpg: string;
  fuelPrice: string;
  customFuelPrice: string;
  customPricePlaceholder: string;
  countrySelect: string;
  detectingLocation: string;
  locationDetected: string;
  locationFailed: string;
  averageConsumption: string;
  consumptionUnit: string;
  consumptionPresets: string;
  
  // Amortization
  amortizationLabel: string;
  amortizationDesc: string;
  amortizationRate: string;
  
  // Passengers / Split
  passengers: string;
  splitCost: string;
  perPerson: string;
  
  // Summary results
  totalCost: string;
  fuelCostOnly: string;
  amortizationCostOnly: string;
  fuelNeeded: string;
  costPerKm: string;
  summaryTitle: string;
  costBreakdown: string;
  copySummary: string;
  summaryCopied: string;
  resetAll: string;
  
  // Address search
  searchingAddresses: string;
  noAddressFound: string;
  liveFxRate: string;

  // Footer & Donations
  kofiButtonText: string;
  kofiTitle: string;
  kofiTooltip: string;
  footerNote: string;
  configInfo: string;
  freeRoutingNotice: string;
  
  // Tooltips & Info
  sourceInfo: string;
  freeApiBadge: string;
}

export const translations: Record<Language, Translations> = {
  hu: {
    appTitle: 'Üzemanyag Kalkulátor',
    appSubtitle: 'Pontos útiköltség-számítás valós idejű üzemanyagárakkal és ingyenes útvonaltervezővel',
    badgeLivePrices: 'Országos átlagárak',
    
    tripPlanner: 'Címek megadása (Útvonaltervező)',
    directDistance: 'Közvetlen távolság megadása (km)',
    
    fromAddress: 'Indulási cím vagy település',
    toAddress: 'Érkezési cím vagy település',
    fromPlaceholder: 'Pl. Budapest, Deák Ferenc tér vagy Bécs',
    toPlaceholder: 'Pl. Debrecen, Nagyerdő vagy Győr',
    swapAddresses: 'Címek megcserélése',
    calculatingRoute: 'Útvonal keresése...',
    calculateRouteBtn: 'Útvonal és távolság számítása',
    routeNotFound: 'Nem sikerült útvonalat találni a megadott címek között. Kérjük, pontosítsd a címeket!',
    routeFound: 'Útvonal kiszámítva',
    distanceLabel: 'Távolság',
    durationLabel: 'Menetidő',
    roundTrip: 'Oda-vissza út (x2 távolság)',
    roundTripNotice: 'A számítás a visszautat is tartalmazza',
    
    fuelType: 'Üzemanyag típusa',
    petrol95: '95 Benzin',
    diesel: 'Dízel',
    premiumPetrol: 'Prémium Benzin (100)',
    premiumDiesel: 'Prémium Dízel',
    lpg: 'LPG (Autógáz)',
    fuelPrice: 'Üzemanyagár',
    customFuelPrice: 'Egyéni ár megadása',
    customPricePlaceholder: 'Pl. 615',
    countrySelect: 'Ország / Régió kiválasztása',
    detectingLocation: 'Helyzet meghatározása...',
    locationDetected: 'Helyzet érzékelve',
    locationFailed: 'Alapértelmezett: Magyarország',
    averageConsumption: 'Átlagfogyasztás',
    consumptionUnit: 'liter / 100 km',
    consumptionPresets: 'Gyors beállítások',
    
    amortizationLabel: 'Amortizációs díj',
    amortizationDesc: 'Kopási, fenntartási és szervizköltségek fedezésére (alapértelmezetten +15 Ft/km)',
    amortizationRate: 'Díj mértéke: 15 Ft / km',
    
    passengers: 'Utasok száma (Költségmegosztás)',
    splitCost: 'Költség fejenként',
    perPerson: 'fő',
    
    totalCost: 'Várható összköltség',
    fuelCostOnly: 'Üzemanyagköltség',
    amortizationCostOnly: 'Amortizációs összeg',
    fuelNeeded: 'Szükséges üzemanyag',
    costPerKm: 'Költség / km',
    summaryTitle: 'Útiköltség Összesítő',
    costBreakdown: 'Költségmegoszlás',
    copySummary: 'Összesítő másolása',
    summaryCopied: 'Kimásolva a vágólapra!',
    resetAll: 'Alaphelyzetbe állítás',
    
    searchingAddresses: 'Címek keresése folyamatban...',
    noAddressFound: 'Nem található a keresésnek megfelelő cím',
    liveFxRate: 'Valós idejű banki devizaárfolyam',
    
    kofiButtonText: 'Borravaló',
    kofiTitle: 'Hívj meg egy kávéra!',
    kofiTooltip: 'Ha hasznosnak találtad az oldalt, hívj meg egy kávéra!',
    footerNote: 'Minimalista üzemanyag kalkulátor. Ingyenes OpenStreetMap & OSRM útvonalszámítás, bankkártya- és rejtett díjmentes működés.',
    configInfo: 'Beállítások & API kulcsok a beállításokban módosíthatók.',
    freeRoutingNotice: '100% ingyenes, kvótamentes útvonal-kalkuláció (OSRM / OpenStreetMap)',
    
    sourceInfo: 'Forrás: Hivatalos európai átlagárak és középértékek',
    freeApiBadge: 'Ingyenes API integráció',
  },
  en: {
    appTitle: 'Fuel Cost Calculator',
    appSubtitle: 'Accurate trip cost calculations with real-time fuel prices and free route planning',
    badgeLivePrices: 'National Average Prices',
    
    tripPlanner: 'Route Planner (Two Addresses)',
    directDistance: 'Direct Distance (km)',
    
    fromAddress: 'Origin address or city',
    toAddress: 'Destination address or city',
    fromPlaceholder: 'E.g. Budapest, Hungary or Vienna',
    toPlaceholder: 'E.g. Debrecen, Hungary or Graz',
    swapAddresses: 'Swap addresses',
    calculatingRoute: 'Finding route...',
    calculateRouteBtn: 'Calculate Route & Distance',
    routeNotFound: 'Could not find a driving route between the addresses. Please specify the addresses.',
    routeFound: 'Route calculated',
    distanceLabel: 'Distance',
    durationLabel: 'Est. Drive Time',
    roundTrip: 'Round Trip (2x distance)',
    roundTripNotice: 'Calculation includes the return trip',
    
    fuelType: 'Fuel Type',
    petrol95: '95 Petrol / Gas',
    diesel: 'Diesel',
    premiumPetrol: 'Premium Petrol (100)',
    premiumDiesel: 'Premium Diesel',
    lpg: 'LPG (Autogas)',
    fuelPrice: 'Fuel Price',
    customFuelPrice: 'Custom price override',
    customPricePlaceholder: 'E.g. 615',
    countrySelect: 'Country / Region Selection',
    detectingLocation: 'Detecting location...',
    locationDetected: 'Location detected',
    locationFailed: 'Default: Hungary',
    averageConsumption: 'Average Consumption',
    consumptionUnit: 'liters / 100 km',
    consumptionPresets: 'Quick presets',
    
    amortizationLabel: 'Vehicle Depreciation / Amortization',
    amortizationDesc: 'Covers wear, maintenance, and vehicle depreciation (+15 HUF/km)',
    amortizationRate: 'Rate: 15 HUF / km',
    
    passengers: 'Passengers (Cost split)',
    splitCost: 'Cost per passenger',
    perPerson: 'person',
    
    totalCost: 'Total Estimated Cost',
    fuelCostOnly: 'Fuel Cost',
    amortizationCostOnly: 'Amortization Cost',
    fuelNeeded: 'Required Fuel',
    costPerKm: 'Cost per km',
    summaryTitle: 'Trip Cost Summary',
    costBreakdown: 'Cost Breakdown',
    copySummary: 'Copy Summary',
    summaryCopied: 'Copied to clipboard!',
    resetAll: 'Reset All',
    
    searchingAddresses: 'Searching addresses...',
    noAddressFound: 'No matching address found',
    liveFxRate: 'Live market exchange rates',
    
    kofiButtonText: 'Tip',
    kofiTitle: 'Buy me a coffee!',
    kofiTooltip: 'If you liked this tool, buy me a coffee!',
    footerNote: 'Minimalist fuel calculator. Free OpenStreetMap & OSRM routing, no credit card required, completely free.',
    configInfo: 'Settings & API keys can be customized in settings.',
    freeRoutingNotice: '100% Free routing integration (OSRM / OpenStreetMap)',
    
    sourceInfo: 'Source: Official European benchmark fuel prices',
    freeApiBadge: 'Free API Integration',
  }
};
