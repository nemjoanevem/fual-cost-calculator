# Fuel Cost Calculator (Üzemanyag Kalkulátor)

A minimalist, responsive trip cost and fuel calculator web application built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Country-Specific Fuel Prices**: Real-time benchmark fuel prices for 16+ countries (Hungary, Austria, Germany, Slovakia, Romania, Croatia, Slovenia, Czech Republic, Poland, Italy, France, Spain, Netherlands, Switzerland, UK, USA).
- **24-Hour Smart Caching**: Stale-while-revalidate pattern using localStorage; prices load instantly with 0ms delay, and silently update in the background if older than 24 hours. The last updated date is displayed beneath the selected country.
- **Automatic Geolocation**: Detects the user's country on load with a graceful fallback to Hungary (`HU`).
- **Custom Price Override**: Option to manually enter the exact local fuel station price per liter.
- **Route Planning**: Address-to-address driving route calculation powered by OpenStreetMap (Photon geocoding) and OSRM, with options to avoid toll roads and ferries.
- **Autocomplete Address Search**: Instant feedback dropdown with an animated loading spinner while querying address suggestions.
- **Direct Distance Mode**: Clean input for known driving distances (default: 120 km).
- **Vehicle Amortization Fee**: Checkbox to include standard wear, depreciation, and maintenance fees (defaults to +15 HUF/km).
- **Real-Time Currency Conversion**: Live exchange rates fetched via public APIs (`open.er-api.com` / `frankfurter.dev`) for HUF, EUR, and USD.
- **Passenger Cost Splitting**: Calculate split costs per person with customizable passenger count (default: 1 person).
- **Round-Trip Toggle**: Easily double distance and calculations for return journeys.
- **Bilingual Interface**: Full support for Hungarian (default) and English.
- **Minimalist Responsive Design**: Clean dark interface optimized for mobile, tablet, and desktop screens.
- **One-Click Summary Copy**: Copy formatted trip summaries directly to your clipboard for expense reporting or messaging.

## Tech Stack

- **Framework**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Motion
- **Build Tool**: Vite

## Configuration

All configurable values are centralized in `src/config.ts`:

```typescript
export interface AppConfig {
  kofiUrl: string;                  // Donation / support profile URL
  defaultCountry: string;           // Default ISO country code ('HU')
  defaultAmortizationRate: number;  // Standard depreciation rate in HUF/km (15)
  googleMapsApiKey?: string;        // Optional Google Maps Directions API key
}

export const APP_CONFIG: AppConfig = {
  kofiUrl: 'https://ko-fi.com/sergo_g',
  defaultCountry: 'HU',
  defaultAmortizationRate: 15,
  googleMapsApiKey: '',
};
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── AmortizationSelector.tsx # Amortization fee toggle and rate settings
│   │   ├── CostSummary.tsx         # Result cards, metrics grid, copy summary
│   │   ├── Footer.tsx              # Minimalist footer with donation link
│   │   ├── FuelSelector.tsx        # Country dropdown, fuel type tabs, custom price
│   │   ├── Navbar.tsx              # Navigation bar with language and currency toggles
│   │   └── TripForm.tsx            # Route planner and direct distance inputs
│   ├── services/
│   │   ├── currencyApi.ts          # Live exchange rate fetcher (HUF, EUR, USD)
│   │   ├── fuelApi.ts              # Fuel price benchmarks and geolocation detector
│   │   └── routingApi.ts           # OpenStreetMap Nominatim/Photon and OSRM routing
│   ├── config.ts                   # Central project configuration
│   ├── translations.ts             # Hungarian and English localization dictionaries
│   ├── App.tsx                     # Main application layout and state orchestration
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global styles and Tailwind imports
├── index.html                      # HTML entry template
├── package.json                    # Project dependencies and scripts
└── tsconfig.json                   # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or pnpm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:3000`.

### Production Build

To build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## License

This project is licensed under the Apache-2.0 License.
