import { KeyValue } from '@/pages/flow-canvas/types/index';
import { FieldSchema } from '@/pages/flow-canvas/types/index.ts';

export function flattenSchema(fields: FieldSchema[] = []): KeyValue[] {
  return fields.flatMap(field => [
    { key: field.name, value: field.type },
    ...flattenSchema(field.nestedFields),
  ]);
}
