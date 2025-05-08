import { Field } from '@/common/types';

export interface MockApiFormValues {
  baseUrl: string;
  method: string;
  path: string;
  requestSchema: Field[] | boolean;
  responseSchema: Field[] | boolean;
  x: number;
  y: number;
}
