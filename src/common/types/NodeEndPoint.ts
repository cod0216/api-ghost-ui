/** API Endpoint interface */
export interface NodeEndPoint {
  id: string;
  method: string;
  path: string;
  baseUrl: string;
  body?: Record<string, any>;
  showBody: boolean;
}
