import { useState, useCallback } from 'react';
import { Field } from '@/common/types/index.ts';

/**
 * Hook for managing schema editing state.
 * @param initialSchema - initial Field[] array
 */
export const useBodyEditor = (initialSchema: Field[]) => {
  const [currentSchema, setCurrentSchema] = useState<Field[]>(initialSchema);
  const updateSchema = useCallback((newSchema: Field[]) => {
    setCurrentSchema(newSchema);
  }, []);
  return { currentSchema, updateSchema };
};
