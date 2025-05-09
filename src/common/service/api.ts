import { HttpMethod } from '@/common/types/index.ts';

export interface RequestOptions {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: any;
  params?: Record<string, string | number | boolean>;
  withDefaultHeaders?: boolean;
  isFormData?: boolean;
  authToken?: string;
}

const BASE_URL = 'http://localhost:8080';

const buildQueryString = (params?: Record<string, string | number | boolean>): string =>
  params ? `?${new URLSearchParams(params as any).toString()}` : '';

const buildHeaders = (
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

const buildFetchOptions = (
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

export const request = async <T = any>(
  url: string,
  {
    method = HttpMethod.GET,
    headers = {},
    body,
    params,
    withDefaultHeaders = true,
    isFormData = false,
    authToken,
  }: RequestOptions = {},
): Promise<T> => {
  const fullUrl = `${BASE_URL}${url}${buildQueryString(params)}`;

  const finalHeaders = buildHeaders(headers, withDefaultHeaders, isFormData, authToken);
  const fetchOptions = buildFetchOptions(method, finalHeaders, body, isFormData);

  const response = await fetch(fullUrl, fetchOptions);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json')
    ? response.json()
    : (response.text() as unknown as T);
};
