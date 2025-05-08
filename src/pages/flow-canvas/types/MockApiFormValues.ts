import { Field } from '@/common/types';

export interface MockApiFormValues {
  baseUrl: string;
  method: string;
  path: string;
  requestSchema: Field[];
  responseSchema: Field[];
  x: number;
  y: number;
}
