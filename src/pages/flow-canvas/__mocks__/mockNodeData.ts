/**
 * @fileoverview endpoint data
 *
 * Provides mock endpoint data used for simulating nodes in the FlowCanvas.
 * Each endpoint includes an ID, HTTP method, and a path to represent
 * an API request structure in scenario flows.
 */

import { HttpMethod } from '@/common/types/HttpMethod.ts';
import { NodeEndPoint } from '@/common/types/NodeEndPoint.ts';

export const mockEndpoints: NodeEndPoint[] = [
  { id: '1', method: HttpMethod.GET, path: '/api/auths/login' },
  { id: '2', method: HttpMethod.POST, path: '/api/users' },
  { id: '3', method: HttpMethod.PUT, path: '/api/users/1' },
  { id: '4', method: HttpMethod.DELETE, path: '/api/users/1' },
  { id: '5', method: HttpMethod.STOMP, path: '/app/chat/send' },
];
