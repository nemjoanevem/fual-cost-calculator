export interface AppConfig {
  kofiUrl: string;
  defaultCountry: string;
  defaultAmortizationRate: number;
  googleMapsApiKey?: string;
}

export const APP_CONFIG: AppConfig = {
  kofiUrl: 'https://ko-fi.com/sergo_g',
  defaultCountry: 'HU',
  defaultAmortizationRate: 15,
  googleMapsApiKey: '',
};
