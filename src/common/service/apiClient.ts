import { request } from '@/common/service/api';
import { RequestOptions, HttpMethod } from '@/common/types';

type Params = Record<string, string | number | boolean>;

interface ClientOptions extends Omit<RequestOptions, 'method' | 'body' | 'params'> {}

export const apiClient = {
  get: <T>(url: string, params?: Params, options: ClientOptions = {}): Promise<T> =>
    request<T>(url, {
      method: HttpMethod.GET,
      params,
      ...options,
    }),

  post: <T>(
    url: string,
    body?: any,
    options: ClientOptions & { isFormData?: boolean } = {},
  ): Promise<T> =>
    request<T>(url, {
      method: HttpMethod.POST,
      body,
      ...options,
    }),

  put: <T>(
    url: string,
    body?: any,
    options: ClientOptions & { isFormData?: boolean } = {},
  ): Promise<T> =>
    request<T>(url, {
      method: HttpMethod.PUT,
      body,
      ...options,
    }),

  delete: <T>(url: string, params?: Params, options: ClientOptions = {}): Promise<T> =>
    request<T>(url, {
      method: HttpMethod.DELETE,
      params,
      ...options,
    }),

  fetch: <T>(url: string, body?: any, options: ClientOptions = {}): Promise<T> =>
    request<T>(url, {
      method: HttpMethod.FETCH,
      body,
      ...options,
    }),

  sse: (
    url: string,
    params: Params = {},
    onMessage: (event: MessageEvent) => void,
    onError?: (this: EventSource, ev: Event) => any,
  ): EventSource => {
    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)])),
    ).toString();

    const fullUrl = `${url}?${queryString}`;
    const eventSource = new EventSource(fullUrl);

    eventSource.onmessage = onMessage;
    eventSource.onerror = onError ?? null;

    return eventSource;
  },
};
