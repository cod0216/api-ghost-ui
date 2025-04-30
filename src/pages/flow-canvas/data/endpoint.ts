/**
 * @fileoverview Defines the Endpoint type, HttpMethod union data
 * for use in the FlowCanvas drag-and-drop scenario builder.
 */

/** HTTP method types */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'FETCH' | 'STOMP';

/** API Endpoint interface */
export interface Endpoint {
  id: string;
  method: HttpMethod;
  path: string;
}

/**
 * mock endpoint data
 */
export const mockEndpoints: Endpoint[] = [
  { id: '1', method: 'GET', path: '/api/auths/login' },
  { id: '2', method: 'POST', path: '/api/users' },
  { id: '3', method: 'PUT', path: '/api/users/1' },
  { id: '4', method: 'DELETE', path: '/api/users/1' },
  { id: '5', method: 'STOMP', path: '/app/chat/send' },
];
