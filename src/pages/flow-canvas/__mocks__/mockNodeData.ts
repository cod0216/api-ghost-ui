/**
 * mock endpoint data
 */
import { HttpMethod } from '@/types/HttpMethod.ts';
import { NodeEndPoint } from '@/types/NodeEndPoint.ts';

export const mockEndpoints: NodeEndPoint[] = [
  { id: '1', method: HttpMethod.GET, path: '/api/auths/login' },
  { id: '2', method: HttpMethod.POST, path: '/api/users' },
  { id: '3', method: HttpMethod.PUT, path: '/api/users/1' },
  { id: '4', method: HttpMethod.DELETE, path: '/api/users/1' },
  { id: '5', method: HttpMethod.STOMP, path: '/app/chat/send' },
];
