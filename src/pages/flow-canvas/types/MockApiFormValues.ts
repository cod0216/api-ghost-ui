import { Field, HttpMethod } from '@/common/types';

export interface MockApiFormValues {
  baseUrl: string;
  method: HttpMethod;
  path: string;
  requestSchema: Field[];
  responseSchema: Field[];
  x: number;
  y: number;
}
