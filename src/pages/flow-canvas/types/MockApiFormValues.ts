import { HttpMethod } from '@/common/types/index.ts';

export interface MockApiFormValues {
  baseUrl: string;
  method: HttpMethod;
  path: string;
  requestSchema: string;
  responseSchema: string;
  x: number;
  y: number;
}
