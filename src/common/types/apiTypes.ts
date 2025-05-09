export enum ProtocolType {
  HTTP = 'HTTP',
  WS = 'WS',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  FETCH = 'FETCH',
  WEBSOCKET = 'WEBSOCKET',
}

export interface HttpRequest {
  method: HttpMethod;
  url: string;
  header: Record<string, string>;
  body?: RequestBody;
}

export interface RequestBody {
  formdata?: any;
  json?: string;
}
