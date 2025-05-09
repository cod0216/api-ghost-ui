import React, { MouseEvent, useState, useEffect } from 'react';
import styles from '@/pages/flow-canvas/styles/MappingModal.module.scss';
import { MockApiFormValues } from '@/pages/flow-canvas/types/index';
import { CommonButton } from '@/common/components/CommonButton';
import { HttpMethod } from '@/common/types/index';

interface MockApiModalProps {
  isVisible: boolean;
  formValues: MockApiFormValues;
  resSchemaText: string;
  reqSchemaText: string;
  baseUrl: string;
  path: string;
  method: HttpMethod;
  isSchemaValid: boolean;
  setBaseUrl: (v: string) => void;
  setMethod: (v: HttpMethod) => void;
  setPath: (v: string) => void;
  setIsSchemaValid: (v: boolean) => void;
  setReqSchemaText: (v: string) => void;
  setResSchemaText: (v: string) => void;
  onConfirm: (
    values: MockApiFormValues & {
      requestSchemaText: string;
      responseSchemaText: string;
      isSchemaValid: boolean;
    },
  ) => void;
  onCancel: () => void;
  validateSchemas: (reqText: string, resText: string) => void;
}

const methods = Object.values(HttpMethod).filter(m =>
  ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(m),
);

export const MockApiModal: React.FC<MockApiModalProps> = ({
  isVisible,
  formValues,
  resSchemaText,
  reqSchemaText,
  baseUrl,
  path,
  method,
  isSchemaValid,
  setResSchemaText,
  setReqSchemaText,
  setPath,
  setMethod,
  setBaseUrl,
  onConfirm,
  onCancel,
}) => {
  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  const handleReqChange = (text: string) => {
    setReqSchemaText(text);
  };

  const handleResChange = (text: string) => {
    setResSchemaText(text);
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
          <select value={method} onChange={e => setMethod(e.target.value as HttpMethod)}>
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
