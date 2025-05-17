import React, { MouseEvent, useState, useEffect } from 'react';
import styles from '@/pages/flow-canvas/styles/EdgeModal.module.scss';
import { Edge } from 'reactflow';
import { MappingPair } from '@/pages/flow-canvas/types/mapping';
import { CommonButton } from '@/common/components/CommonButton';

interface EdgeModalProps {
  edgeInfo: Edge | null;
  setEdges: (updater: (edges: Edge[]) => Edge[]) => void;
  onClose: () => void;
}

const EdgeModal: React.FC<EdgeModalProps> = ({ edgeInfo, setEdges, onClose }) => {
  if (!edgeInfo) return null;

  const initialStatus = edgeInfo?.data?.expected?.status ?? '';
  const [statusCode, setStatusCode] = useState<string>(initialStatus);
  const [expectedRows, setExpectedRows] = useState<MappingPair[]>([
    { sourceKey: '', targetKey: '' },
  ]);
  const [mappingRows, setMappingRows] = useState<MappingPair[]>([{ sourceKey: '', targetKey: '' }]);

  useEffect(() => {
    setStatusCode(edgeInfo.data?.expected?.status ?? '');
    const valueObj =
      edgeInfo.data?.expected?.value && typeof edgeInfo.data.expected.value === 'object'
        ? (edgeInfo.data.expected.value as Record<string, any>)
        : {};
    const expRows = Object.entries(valueObj).length
      ? [
          ...Object.entries(valueObj).map(([k, v]) => ({ sourceKey: k, targetKey: String(v) })),
          { sourceKey: '', targetKey: '' },
        ]
      : [{ sourceKey: '', targetKey: '' }];
    setExpectedRows(expRows);
    const mappingInfo = Array.isArray((edgeInfo.data as any)?.mappingInfo)
      ? ((edgeInfo.data as any).mappingInfo as MappingPair[])
      : [];
    const mapRows = mappingInfo.length
      ? [...mappingInfo, { sourceKey: '', targetKey: '' }]
      : [{ sourceKey: '', targetKey: '' }];
    setMappingRows(mapRows);
  }, [edgeInfo]);

  useEffect(() => {
    const last = expectedRows[expectedRows.length - 1];
    if (last.sourceKey && last.targetKey)
      setExpectedRows(prev => [...prev, { sourceKey: '', targetKey: '' }]);
  }, [expectedRows]);

  useEffect(() => {
    const last = mappingRows[mappingRows.length - 1];
    if (last.sourceKey && last.targetKey)
      setMappingRows(prev => [...prev, { sourceKey: '', targetKey: '' }]);
  }, [mappingRows]);

  const handleExpectedChange = (idx: number, field: 'sourceKey' | 'targetKey', val: string) => {
    setExpectedRows(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };
  const handleExpectedDelete = (idx: number) =>
    setExpectedRows(prev => prev.filter((_, i) => i !== idx));

  const handleMappingChange = (idx: number, field: 'sourceKey' | 'targetKey', val: string) => {
    setMappingRows(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };
  const handleMappingDelete = (idx: number) =>
    setMappingRows(prev => prev.filter((_, i) => i !== idx));

  const handleSave = () => {
    const validExpected = expectedRows.filter(r => r.sourceKey.trim() && r.targetKey.trim());
    const expectedValue = validExpected.reduce<Record<string, any>>(
      (acc, { sourceKey, targetKey }) => {
        acc[sourceKey] = targetKey;
        return acc;
      },
      {},
    );
    const validMapping = mappingRows.filter(r => r.sourceKey.trim() && r.targetKey.trim());

    setEdges(es =>
      es.map(e =>
        e.id === edgeInfo.id
          ? {
              ...e,
              data: {
                ...e.data,
                expected: { status: statusCode, value: expectedValue },
                mappingInfo: validMapping,
              },
            }
          : e,
      ),
    );
    onClose();
  };

  const stopPropagation = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

  return (
    <div className={styles.edgeContainer}>
      <div className={styles.modal} onClick={stopPropagation}>
        <div className={styles.mappingHeader}>
          <div className={styles.title}>Edge Setting</div>
        </div>
        <div className={styles.fieldRow}>
          <label>Status:</label>
          <input type="text" value={statusCode} onChange={e => setStatusCode(e.target.value)} />
        </div>
        <div className={styles.sectionTitle}>Expected Value</div>
        <div className={styles.mappingTableWrapper}>
          <table className={styles.mappingTable}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expectedRows.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      placeholder="key"
                      value={row.sourceKey}
                      onChange={e => handleExpectedChange(idx, 'sourceKey', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="value"
                      value={row.targetKey}
                      onChange={e => handleExpectedChange(idx, 'targetKey', e.target.value)}
                    />
                  </td>
                  <td>
                    {(row.sourceKey || row.targetKey) && (
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleExpectedDelete(idx)}
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.sectionTitle}>Mapping</div>
        <div className={styles.mappingTableWrapper}>
          <table className={styles.mappingTable}>
            <thead>
              <tr>
                <th>Response</th>
                <th>Request</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mappingRows.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      placeholder="response key"
                      value={row.sourceKey}
                      onChange={e => handleMappingChange(idx, 'sourceKey', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="request key"
                      value={row.targetKey}
                      onChange={e => handleMappingChange(idx, 'targetKey', e.target.value)}
                    />
                  </td>
                  <td>
                    {(row.sourceKey || row.targetKey) && (
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleMappingDelete(idx)}
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.actions}>
          <CommonButton
            onConfirm={handleSave}
            onCancel={onClose}
            confirmLabel="Save"
            cancelLabel="Cancel"
          />
        </div>
      </div>
    </div>
  );
};

export default EdgeModal;
