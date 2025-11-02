export interface AppConfig {
  apiBaseUrl: string;
}

export function loadAppConfig(): AppConfig {
  const apiBaseUrl =
    (import.meta.env.VITE_API_BASE_URL as string) ??
    'http://localhost:7071/api/';

  return {
    apiBaseUrl,
  };
}

export const appConfig = loadAppConfig();
