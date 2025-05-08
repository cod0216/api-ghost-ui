export interface AppConfig {
  baseUrl: string;
}

export const loadConfig = async (): Promise<AppConfig> => {
  const response = await fetch('/apighost-ui/config.json');
  if (!response.ok) {
    throw new Error('Failed to load config');
  }
  return await response.json();
};
