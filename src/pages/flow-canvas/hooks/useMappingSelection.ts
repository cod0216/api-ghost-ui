import { useState, useCallback } from 'react';

export const useMappingSelection = () => {
  const [leftSelectedKeys, setLeftSelectedKeys] = useState<string[]>([]);
  const [rightSelectedKeys, setRightSelectedKeys] = useState<string[]>([]);

  const toggleLeftKey = useCallback((key: string) => {
    setLeftSelectedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  }, []);

  const toggleRightKey = useCallback((key: string) => {
    setRightSelectedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  }, []);

  const clearSelection = useCallback(() => {
    setLeftSelectedKeys([]);
    setRightSelectedKeys([]);
  }, []);

  return {
    leftSelectedKeys,
    rightSelectedKeys,
    toggleLeftKey,
    toggleRightKey,
    clearSelection,
  };
};
