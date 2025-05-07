/** API Endpoint interface */
export interface Field {
  type: string;
  name: string;
  nestedFields?: Field[];
}

export interface NodeEndPoint {
  id: string;
  method: string;
  path: string;
  baseUrl: string;
  requestSchema?: Field[];
  responseSchema?: Field[];
  showBody: boolean;
}
