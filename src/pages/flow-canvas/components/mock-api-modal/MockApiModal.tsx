import React, { MouseEvent, useState, useEffect } from 'react';
import styles from '@/pages/flow-canvas/styles/MappingModal.module.scss';
import { Field } from '@/common/types';
import { MockApiFormValues } from '@/pages/flow-canvas/types/index';
import { CommonButton } from '@/common/components/CommonButton';
interface Props {
  isVisible: boolean;
  formValues: MockApiFormValues;
  onConfirm: (values: MockApiFormValues) => void;
  onCancel: () => void;
}

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export const MockApiModal: React.FC<Props> = ({ isVisible, formValues, onConfirm, onCancel }) => {
  const [baseUrl, setBaseUrl] = useState(formValues.baseUrl);
  const [method, setMethod] = useState(formValues.method);
  const [path, setPath] = useState(formValues.path);
  const [reqSchema, setReqSchema] = useState<Field[]>(formValues.requestSchema);
  const [resSchema, setResSchema] = useState<Field[]>(formValues.responseSchema);

  useEffect(() => {
    setBaseUrl(formValues.baseUrl);
    setMethod(formValues.method);
    setPath(formValues.path);
    setReqSchema(formValues.requestSchema);
    setResSchema(formValues.responseSchema);
  }, [formValues]);

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();
  const handleConfirm = () =>
    onConfirm({
      ...formValues,
      baseUrl,
      method,
      path,
      requestSchema: reqSchema,
      responseSchema: resSchema,
    });

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
          <textarea
            value={JSON.stringify(reqSchema, null, 2)}
            onChange={e => {
              try {
                setReqSchema(JSON.parse(e.target.value));
              } catch {}
            }}
          />
        </div>
        <div className={styles.schemaSection}>
          <h3>Response Schema</h3>
          <textarea
            value={JSON.stringify(resSchema, null, 2)}
            onChange={e => {
              try {
                setResSchema(JSON.parse(e.target.value));
              } catch {}
            }}
          />
        </div>

        <CommonButton
          onConfirm={handleConfirm}
          onCancel={() => {
            onCancel;
          }}
        />
      </div>
    </div>
  );
};
