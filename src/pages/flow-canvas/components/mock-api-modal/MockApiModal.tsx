import React, { MouseEvent, useState, useEffect } from 'react';
import styles from '@/pages/flow-canvas/styles/MappingModal.module.scss';
import { MockApiFormValues } from '@/pages/flow-canvas/types/index';
import { CommonButton } from '@/common/components/CommonButton';

interface Props {
  isVisible: boolean;
  formValues: MockApiFormValues;
  onConfirm: (
    values: MockApiFormValues & {
      requestSchemaText: string;
      responseSchemaText: string;
      isSchemaValid: boolean;
    },
  ) => void;
  onCancel: () => void;
}

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export const MockApiModal: React.FC<Props> = ({ isVisible, formValues, onConfirm, onCancel }) => {
  const [baseUrl, setBaseUrl] = useState(formValues.baseUrl);
  const [method, setMethod] = useState(formValues.method);
  const [path, setPath] = useState(formValues.path);

  const [reqSchemaText, setReqSchemaText] = useState(
    JSON.stringify(formValues.requestSchema, null, 2),
  );
  const [resSchemaText, setResSchemaText] = useState(
    JSON.stringify(formValues.responseSchema, null, 2),
  );

  const [isSchemaValid, setIsSchemaValid] = useState(true);

  const validateSchemas = (reqText: string, resText: string) => {
    try {
      JSON.parse(reqText);
      JSON.parse(resText);
      setIsSchemaValid(true);
    } catch {
      setIsSchemaValid(false);
    }
  };

  useEffect(() => {
    setBaseUrl(formValues.baseUrl);
    setMethod(formValues.method);
    setPath(formValues.path);

    const initialReq = JSON.stringify(formValues.requestSchema, null, 2);
    const initialRes = JSON.stringify(formValues.responseSchema, null, 2);
    setReqSchemaText(initialReq);
    setResSchemaText(initialRes);

    validateSchemas(initialReq, initialRes);
  }, [formValues]);

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  const handleReqChange = (text: string) => {
    setReqSchemaText(text);
    validateSchemas(text, resSchemaText);
  };

  const handleResChange = (text: string) => {
    setResSchemaText(text);
    validateSchemas(reqSchemaText, text);
  };

  const handleConfirm = () => {
    onConfirm({
      ...formValues,
      baseUrl,
      method,
      path,
      requestSchemaText: reqSchemaText,
      responseSchemaText: resSchemaText,
      isSchemaValid,
    });
    onCancel();
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay} onClick={stopPropagation}>
      <div className={styles.modal} onClick={stopPropagation}>
        <h2>Create Mock API Node</h2>

        <label>
          Base URL:
          <input value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
        </label>

        <label>
          Method:
          <select value={method} onChange={e => setMethod(e.target.value)}>
            {methods.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label>
          Path:
          <input value={path} onChange={e => setPath(e.target.value)} />
        </label>

        <div className={styles.schemaSection}>
          <h3>Request Schema</h3>
          <textarea value={reqSchemaText} onChange={e => handleReqChange(e.target.value)} />
        </div>

        <div className={styles.schemaSection}>
          <h3>Response Schema</h3>
          <textarea value={resSchemaText} onChange={e => handleResChange(e.target.value)} />
        </div>
        <CommonButton onConfirm={handleConfirm} onCancel={onCancel} />
      </div>
    </div>
  );
};
