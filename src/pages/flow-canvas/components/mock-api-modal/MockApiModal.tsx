import React, { MouseEvent } from 'react';
import styles from '@/pages/flow-canvas/styles/MockApiModal.module.scss';
import { MockApiFormValues } from '@/pages/flow-canvas/types/index';
import { CommonButton } from '@/common/components/CommonButton';
import { HttpMethod } from '@/common/types/index';
import { useMockApiModal } from '@/pages/flow-canvas/hooks/useMockApiModal';

interface MockApiModalProps {
  closeModal: () => void;
  onConfirm: (saved: MockApiFormValues) => void;
}

const methods = Object.values(HttpMethod);

export const MockApiModal: React.FC<MockApiModalProps> = ({ onConfirm, closeModal }) => {
  const stopPropagation = (e: MouseEvent) => e.stopPropagation();
  const {
    method,
    path,
    baseUrl,
    reqSchemaText,
    resSchemaText,
    setReqSchemaText,
    setResSchemaText,
    setPath,
    saveMockApi,
    setBaseUrl,
    setMethod,
  } = useMockApiModal();

  const handleReqChange = (text: string) => {
    setReqSchemaText(text);
  };

  const handleResChange = (text: string) => {
    setResSchemaText(text);
  };

  const handleConfirm = () => {
    const saved: MockApiFormValues = saveMockApi();
    onConfirm(saved);
    closeModal();
  };

  return (
    <div className={styles.overlay} onClick={stopPropagation}>
      <div className={styles.modal} onClick={stopPropagation}>
        <div className={styles.header}>
          <h2>Create Mock API Node</h2>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.inputRow}>
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
              Base URL:
              <input value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
            </label>

            <label>
              Path:
              <input value={path} onChange={e => setPath(e.target.value)} />
            </label>
          </div>

          <div className={styles.schemaRow}>
            <div className={styles.schemaSection}>
              <h3>Request Schema</h3>
              <textarea value={reqSchemaText} onChange={e => handleReqChange(e.target.value)} />
            </div>

            <div className={styles.schemaSection}>
              <h3>Response Schema</h3>
              <textarea value={resSchemaText} onChange={e => handleResChange(e.target.value)} />
            </div>
          </div>
        </div>

        <CommonButton onConfirm={handleConfirm} onCancel={closeModal} />
      </div>
    </div>
  );
};
