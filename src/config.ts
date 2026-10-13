/**
 * Üzemanyag Kalkulátor - Központi Beállítások / Configuration File
 * 
 * Itt tudod megadni a saját API kulcsaidat, a Ko-fi linket és az alapértelmezett értékeket.
 * You can configure your custom API keys, Ko-fi donation link, and default values here.
 */

export interface AppConfig {
  /**
   * Ko-fi profil link
   * Cseréld le a saját Ko-fi linketedre (pl. "https://ko-fi.com/felhasznaloneved")
   */
  kofiUrl: string;

  /**
   * Ko-fi gomb szövege (ha egyedit szeretnél)
   */
  kofiUsername: string;

  /**
   * Alapértelmezett országkód (ISO-2 formátum), ha a helyzetmeghatározás sikertelen
   * Default: "HU" (Magyarország)
   */
  defaultCountry: string;

  /**
   * Alapértelmezett amortizációs díj (Ft / km)
   * A felhasználói kérés szerint: 15 Ft/km
   */
  defaultAmortizationHufPerKm: number;

  /**
   * Útvonaltervező szolgáltató ('osrm' = 100% Ingyenes OpenStreetMap OSRM, nincs szükség kulcsra!
   * 'google' = Google Maps API kulccsal)
   */
  routingProvider: 'osrm' | 'google';

  /**
   * Opcionális Google Maps API kulcs
   * Ha van Google Cloud fiókod és szeretnéd azt használni az OSRM helyett,
   * ide írd be a kulcsodat: pl. "AIzaSy..."
   */
  googleMapsApiKey?: string;

  /**
   * Google Maps API hívási limit munkamenetenként (biztonsági korlát, hogy sose érj el fizetős keretet)
   */
  googleMapsSessionLimit: number;

  /**
   * Opcionális külső üzemanyagár API kulcs vagy végpont (pl. Collector API, Tankerkönig stb.)
   * Alapértelmezetten a beépített és rendszeresen frissülő európai benchmark adatbázist használjuk.
   */
  fuelPriceApiKey?: string;
}

export const APP_CONFIG: AppConfig = {
  // === KO-FI BEÁLLÍTÁSOK ===
  // Írd be a saját Ko-fi oldalad linkjét:
  kofiUrl: 'https://ko-fi.com/sergo_g',
  kofiUsername: 'Kalkulátor Fejlesztő',

  // === ALAPÉRTELMEZETT BEÁLLÍTÁSOK ===
  defaultCountry: 'HU', // Magyarország
  defaultAmortizationHufPerKm: 15, // 15 Ft / km

  // === ÚTVONALTERVEZŐ BEÁLLÍTÁSOK ===
  // 'osrm' = Teljesen ingyenes nyílt forráskódú OpenStreetMap motor, nem igényel semmilyen bankkártyát vagy API kulcsot!
  routingProvider: 'osrm',

  // Ha mégis Google Maps API-t szeretnél használni, másold be ide az API kulcsodat:
  googleMapsApiKey: '',

  // Biztonsági limit Google Maps hívásokhoz (hogy biztosan a havi ingyenes kereten belül maradj):
  googleMapsSessionLimit: 50,

  // Opcionális egyedi üzemanyagár szolgáltató kulcs:
  fuelPriceApiKey: '',
};
