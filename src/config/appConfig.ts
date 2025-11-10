export interface AppConfig {
  apiBaseUrl: string;
  appInsightsConnectionString?: string;
}

export function loadAppConfig(): AppConfig {
  const apiBaseUrl =
    (import.meta.env.VITE_API_BASE_URL as string) ??
    'http://localhost:7071/api/';

  const appInsightsConnectionString = import.meta.env
    .VITE_APPINSIGHTS_CONNECTION_STRING as string | undefined;

  return {
    apiBaseUrl,
    appInsightsConnectionString,
  };
}

export const appConfig = loadAppConfig();
