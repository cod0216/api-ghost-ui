// import { KeyValue } from '@/pages/flow-canvas/types/mapping';

// export const flattenSchema = (fields: Field[], parentKey: string = ''): KeyValue[] => {
//   return fields.flatMap(f => {
//     const fullKey = parentKey ? `${parentKey}.${f.name}` : f.name;
//     if (f.nestedFields && f.nestedFields.length) {
//       return flattenSchema(f.nestedFields, fullKey);
//     }
//     return [{ key: fullKey, value: `${f.value ?? ''}`, type: f.type }];
//   });
// };
