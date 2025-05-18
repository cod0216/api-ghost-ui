import { useState } from 'react';
import { HttpMethod } from '@/common/types';
import { MockApiFormValues } from '@/pages/flow-canvas/types/index';

export const useMockApiModal = () => {
  const [isSchemaValid, setIsSchemaValid] = useState(true);
  const [formValues, setFormValues] = useState<MockApiFormValues>({
    baseUrl: '',
    method: HttpMethod.GET,
    path: '',
    requestSchema: '{}',
    responseSchema: '{}',
    x: 0,
    y: 0,
  });

  const [isVisible, setVisible] = useState(false);
  const [baseUrl, setBaseUrl] = useState(formValues.baseUrl);
  const [method, setMethod] = useState<HttpMethod>(formValues.method);
  const [path, setPath] = useState(formValues.path);

  const [reqSchemaText, setReqSchemaText] = useState(
    JSON.stringify(formValues.requestSchema, null, 2),
  );
  const [resSchemaText, setResSchemaText] = useState(
    JSON.stringify(formValues.responseSchema, null, 2),
  );
  const init: MockApiFormValues = {
    baseUrl: '',
    method: HttpMethod.GET,
    path: '',
    requestSchema: '{}',
    responseSchema: '{}',
    x: 0,
    y: 0,
  };

  const openMockApiModal = (x: number, y: number) => {
    setFormValues({ ...init, x, y });
    setVisible(true);
  };

  const closeMockApiModal = () => {
    setVisible(false);
  };

  const saveMockApi = (): MockApiFormValues => {
    try {
      const requestSchema: string = reqSchemaText;
      const responseSchema: string = resSchemaText;

      const values: MockApiFormValues = {
        ...formValues,
        baseUrl,
        method,
        path,
        requestSchema,
        responseSchema,
      };

      return values;
    } catch (e) {
      console.error('Failed to save mock API due to invalid schema', e);
      setIsSchemaValid(false);
      return init;
    }
  };

  const setReqSchemaTextWithValidation = (text: string) => {
    setReqSchemaText(text);
    validateSchemas(text, resSchemaText);
  };

  const setResSchemaTextWithValidation = (text: string) => {
    setResSchemaText(text);
    validateSchemas(reqSchemaText, text);
  };

  const validateSchemas = (reqText: string, resText: string) => {
    try {
      JSON.parse(reqText);
      JSON.parse(resText);
      setIsSchemaValid(true);
    } catch {
      setIsSchemaValid(false);
    }
  };

  return {
    isVisible,
    formValues,
    baseUrl,
    path,
    method,
    isSchemaValid,
    reqSchemaText,
    resSchemaText,
    openMockApiModal,
    closeMockApiModal,
    saveMockApi,
    setBaseUrl,
    setMethod,
    setPath,
    setIsSchemaValid,
    setReqSchemaText: setReqSchemaTextWithValidation,
    setResSchemaText: setResSchemaTextWithValidation,
    validateSchemas,
  };
};
