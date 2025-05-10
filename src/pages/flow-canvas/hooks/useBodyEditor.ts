import { useState, useCallback } from 'react';
import { Field } from '@/pages/flow-canvas/types/index';

function deepCloneWithValue(fields: Field[]): Field[] {
  return fields.map(f => ({
    type: f.type,
    name: f.name,
    nestedFields: f.nestedFields ? deepCloneWithValue(f.nestedFields) : undefined,
    value: (f as any).value ?? 'empty',
  }));
}

/**
 * Hook for managing schema editing state.
 * @param initialSchema - initial Field[] array
 */
export const useBodyEditor = (initialSchema: Field[]) => {
  const [currentSchema, setCurrentSchema] = useState<Field[]>(() =>
    deepCloneWithValue(initialSchema),
  );

  const updateSchema = useCallback((newSchema: Field[]) => {
    setCurrentSchema(newSchema);
  }, []);
  return { currentSchema, updateSchema };
};
