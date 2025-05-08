export interface AppConfig {
  baseUrl: string;
}

export async function loadConfig(): Promise<AppConfig> {
  const response = await fetch('/apighost-ui/config.json');
  if (!response.ok) {
    throw new Error('Failed to load config');
  }
  return await response.json();
}
