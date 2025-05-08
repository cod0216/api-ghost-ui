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
  body?: RequestBody;
}

export interface RequestBody {
  formdata?: any;
  json?: string;
}
