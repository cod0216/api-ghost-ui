import { HttpMethod } from './HttpMethod.ts';
/** API Endpoint interface */
export interface NodeEndPoint {
  id: string;
  method: HttpMethod;
  path: string;
}
