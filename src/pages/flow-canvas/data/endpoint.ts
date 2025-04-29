export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'FETCH' | 'STOMP';

export interface Endpoint {
  id: string;
  method: HttpMethod;
  path: string;
}

export const mockEndpoints: Endpoint[] = [
  { id: '1', method: 'GET', path: '/api/auths/login' },
  { id: '2', method: 'POST', path: '/api/users' },
  { id: '3', method: 'PUT', path: '/api/users/1' },
  { id: '4', method: 'DELETE', path: '/api/users/1' },
  { id: '5', method: 'STOMP', path: '/app/chat/send' },
];
