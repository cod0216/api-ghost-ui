import { HttpMethod } from '@/common/types';

export const buildQueryString = (params?: Record<string, string | number | boolean>): string =>
  params ? `?${new URLSearchParams(params as any).toString()}` : '';

export const buildHeaders = (
  headers: HeadersInit,
  withDefaultHeaders: boolean,
  isFormData: boolean,
  authToken?: string,
): HeadersInit => {
  const defaultHeaders: Record<string, string> = {};

  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (authToken) {
    defaultHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  return withDefaultHeaders ? { ...defaultHeaders, ...headers } : headers;
};

export const buildFetchOptions = (
  method: HttpMethod,
  headers: HeadersInit,
  body: any,
  isFormData: boolean,
): RequestInit => {
  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method !== HttpMethod.GET) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  return options;
};
