import { Field } from '@/pages/flow-canvas/types/index';
import { HttpMethod } from '@/common/types/index.ts';

export interface MockApiFormValues {
  baseUrl: string;
  method: HttpMethod;
  path: string;
  requestSchema: Field[];
  responseSchema: Field[];
  x: number;
  y: number;
}
