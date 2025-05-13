import { Field } from '@/pages/flow-canvas/types';

export const parseJsonToFields = (jsonString: string, rootName: string): Field[] => {
  const parsed = JSON.parse(jsonString);
  return parseValue(parsed, rootName);
};

const parseValue = (value: any, name: string): Field[] => {
  if (Array.isArray(value)) {
    return [
      {
        type: 'array',
        name,
        nestedFields: value.flatMap((item, index) => parseValue(item, `${name}[${index}]`)),
      },
    ];
  } else if (typeof value === 'object' && value !== null) {
    return [
      {
        type: 'object',
        name,
        nestedFields: Object.entries(value).flatMap(([key, val]) => parseValue(val, key)),
      },
    ];
  } else {
    return [
      {
        type: typeof value,
        name,
        value,
      },
    ];
  }
};

export const fieldsToJson = (fields: Field[]): any => {
  const result: any = {};

  for (const field of fields) {
    result[field.name] = parseField(field);
  }

  return result;
};

const parseField = (field: Field): any => {
  if (field.type === 'object') {
    const nested: any = {};
    if (field.nestedFields) {
      for (const nf of field.nestedFields) {
        nested[nf.name] = parseField(nf);
      }
    }
    return nested;
  }

  if (field.type === 'array') {
    if (!field.nestedFields) return [];
    const elements: any[] = [];

    for (const nf of field.nestedFields) {
      const match = nf.name.match(/\[(\d+)\]$/);
      if (match) {
        const index = parseInt(match[1], 10);
        elements[index] = parseField(nf);
      }
    }

    return elements;
  }

  return field.value;
};
