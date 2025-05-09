import { HttpMethod } from '@/common/types';
import { MockApiFormValues } from '@/pages/flow-canvas/types/index';
import { useState } from 'react';

export const useMockApiModal = () => {
  const [isSchemaValid, setIsSchemaValid] = useState(true);
  const [formValues, setFormValues] = useState<MockApiFormValues>({
    baseUrl: '',
    method: HttpMethod.GET,
    path: '',
    requestSchema: [],
    responseSchema: [],
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

  const openMockApiModal = (x: number, y: number) => {
    const init: MockApiFormValues = {
      baseUrl: '',
      method: HttpMethod.GET,
      path: '',
      requestSchema: [],
      responseSchema: [],
      x,
      y,
    };
    setFormValues(init);
    setMethod(init.method);
    setBaseUrl(init.baseUrl);
    setPath(init.path);
    const reqText = JSON.stringify(init.requestSchema, null, 2);
    const resText = JSON.stringify(init.responseSchema, null, 2);
    setReqSchemaText(reqText);
    setResSchemaText(resText);
    validateSchemas(reqText, resText);
    setVisible(true);
  };

  const closeMockApiModal = () => {
    setVisible(false);
  };

  const saveMockApi = (values: MockApiFormValues) => {
    setVisible(false);
    return values;
  };

  const setReqSchemaTextWithValidation = (text: string) => {
    setReqSchemaText(text);
    validateSchemas(text, resSchemaText);
  };

  const setResSchemaTextWithValidation = (text: string) => {
    setResSchemaText(text);
    validateSchemas(text, resSchemaText);
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
