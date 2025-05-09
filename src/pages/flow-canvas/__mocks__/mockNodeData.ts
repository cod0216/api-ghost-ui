/**
 * @fileoverview endpoint data
 *
 * Provides mock endpoint data used for simulating nodes in the FlowCanvas.
 * Each endpoint includes an ID, HTTP method, and a path to represent
 * an API request structure in scenario flows.
 */
import { NodeEndPoint, HttpMethod } from '@/common/types/index.ts';
export const mockEndpoints: NodeEndPoint[] = [
  // {
  //   id: '1',
  //   method: HttpMethod.GET,
  //   path: '/api/auths/login',
  //   baseUrl: 'https://ssafy.com',
  //   body: undefined,
  //   showBody: false,
  // },
  // {
  //   id: '2',
  //   method: HttpMethod.POST,
  //   path: '/api/users',
  //   baseUrl: 'https://ssafy.com',
  //   body: {
  //     name: 'Alice',
  //     email: 'alice@example.com',
  //     password: 'secure123',
  //   },
  //   showBody: false,
  // },
  // {
  //   id: '3',
  //   method: HttpMethod.PUT,
  //   path: '/api/users/1',
  //   baseUrl: 'https://ssafy.com',
  //   body: {
  //     name: 'Alice Updated',
  //   },
  //   showBody: false,
  // },
  // {
  //   id: '4',
  //   method: HttpMethod.DELETE,
  //   path: '/api/users/1',
  //   baseUrl: 'https://ssafy.com',
  //   body: undefined,
  //   showBody: false,
  // },
  // {
  //   id: '5',
  //   method: HttpMethod.STOMP,
  //   path: '/app/chat/send',
  //   baseUrl: 'https://chat.ssafy.com',
  //   body: {
  //     roomId: 'general',
  //     sender: 'alice',
  //     message: 'Hello!',
  //   },
  //   showBody: false,
  // },
];
