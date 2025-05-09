export enum ProtocolType {
  HTTP = 'HTTP',
  STOMP = 'STOMP',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  FETCH = 'FETCH',
  STOMP = 'STOMP',
}

export interface HttpRequest {
  method: HttpMethod;
  url: string;
  header: Record<string, string>;
  body?: RequestBody | null;
}

export interface RequestBody {
  formdata?: FormData | null;
  json?: string | null;
}

export interface RequestOptions {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: any;
  params?: Record<string, string | number | boolean>;
  withDefaultHeaders?: boolean;
  isFormData?: boolean;
  authToken?: string;
}
