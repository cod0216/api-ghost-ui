import { MockApiFormValues } from '@/pages/flow-canvas/types/MockApiFormValues';
import { useState } from 'react';

export const useMockApiModal = () => {
  const [isVisible, setVisible] = useState(false);
  const [formValues, setFormValues] = useState<MockApiFormValues>({
    baseUrl: '',
    method: 'GET',
    path: '',
    requestSchema: [],
    responseSchema: [],
    x: 0,
    y: 0,
  });

  const openMockApiModal = (x: number, y: number) => {
    setFormValues({
      baseUrl: '',
      method: 'GET',
      path: '',
      requestSchema: [],
      responseSchema: [],
      x,
      y,
    });
    setVisible(true);
  };

  const closeMockApiModal = () => {
    setVisible(false);
  };

  const saveMockApi = (values: MockApiFormValues) => {
    setVisible(false);
    return values;
  };

  return {
    isVisible,
    formValues,
    openMockApiModal,
    closeMockApiModal,
    saveMockApi,
  };
};
