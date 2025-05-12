import { HttpMethod, RequestOptions } from '@/common/types';
import { buildQueryString, buildHeaders, buildFetchOptions } from '@/common/utils/apiUtils';

let baseUrl = 'http://localhost:8080';

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
  const fullUrl = `${baseUrl}${url}${buildQueryString(params)}`;

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
