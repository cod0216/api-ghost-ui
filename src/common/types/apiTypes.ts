export enum ProtocolType {
  HTTP = 'HTTP',
  WEBSOCKET = 'WEBSOCKET',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  WEBSOCKET = 'WEBSOCKET',
}

export enum WEBSOCKETMethod {
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
  SEND = 'SEND',
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  WEBSOCKET = 'WEBSOCKET',
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
