import React, { MouseEvent, useState, useEffect } from 'react';
import styles from '@/pages/flow-canvas/styles/EdgeModal.module.scss';
import { Edge } from 'reactflow';
import { MappingPair } from '@/pages/flow-canvas/types/mapping';
import { CommonButton } from '@/common/components/CommonButton';

interface EdgeModalProps {
  isOpen: boolean;
  edgeInfo: Edge | null;
  setEdges: (updater: (edges: Edge[]) => Edge[]) => void;
  onClose: () => void;
}

const EdgeModal: React.FC<EdgeModalProps> = ({ isOpen, edgeInfo, setEdges, onClose }) => {
  // 열려있지 않거나 edge 정보가 없으면 렌더링하지 않음
  if (!isOpen || !edgeInfo) return null;

  // 초기 상태 설정
  const initialStatus = edgeInfo.data?.expected?.status ?? '';
  const initialValue =
    edgeInfo.data?.expected?.value != null ? JSON.stringify(edgeInfo.data.expected.value) : '';
  const initialPairs: MappingPair[] = Array.isArray((edgeInfo.data as any)?.mappingInfo)
    ? (edgeInfo.data as any).mappingInfo
    : [];

  const [status, setStatus] = useState<string>(initialStatus);
  const [value, setValue] = useState<string>(initialValue);
  const [rows, setRows] = useState<MappingPair[]>(
    initialPairs.length > 0
      ? [...initialPairs, { sourceKey: '', targetKey: '' }]
      : [{ sourceKey: '', targetKey: '' }],
  );
  // 새 빈 행 추가 (마지막 행이 모두 채워졌을 때만)
  useEffect(() => {
    if (rows.length === 0) {
      // 아무 행도 없으면 빈 행 하나 추가
      setRows([{ sourceKey: '', targetKey: '' }]);
      return;
    }
    const last = rows[rows.length - 1];
    if (last.sourceKey && last.targetKey) {
      setRows(prev => [...prev, { sourceKey: '', targetKey: '' }]);
    }
  }, [rows]);

  // 행 값 변경 핸들러
  const handleRowChange = (index: number, field: 'sourceKey' | 'targetKey', newVal: string) => {
    setRows(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: newVal };
      return next;
    });
  };

  // 행 삭제 핸들러
  const handleDelete = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  };

  // 저장 버튼 클릭
  const handleSave = () => {
    // 유효한 페어만 필터링
    const validPairs = rows.filter(r => r.sourceKey && r.targetKey);

    // value 파싱 시도
    let parsedValue: any;
    try {
      parsedValue = value ? JSON.parse(value) : null;
    } catch {
      parsedValue = value;
    }

    // edges 업데이트
    setEdges(es =>
      es.map(e =>
        e.id === edgeInfo.id
          ? {
              ...e,
              data: {
                ...(e.data ?? {}),
                expected: { status, value: parsedValue },
                mappingInfo: validPairs,
              },
            }
          : e,
      ),
    );

    // 모달 닫기
    onClose();
  };

  // 배경 클릭 시 모달 닫기
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  const stopPropagation = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.edgeContainer} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={stopPropagation}>
        <h2>Edge Mapping</h2>

        <div className={styles.fieldRow}>
          <label>Status:</label>
          <input type="text" value={status} onChange={e => setStatus(e.target.value)} readOnly />
        </div>
        <div className={styles.fieldRow}>
          <label>Value:</label>
          <textarea rows={1} value={value} onChange={e => setValue(e.target.value)} readOnly />
        </div>

        <table className={styles.mappingTable}>
          <thead>
            <tr>
              <th>Response</th>
              <th>Request</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    type="text"
                    value={row.sourceKey}
                    onChange={e => handleRowChange(idx, 'sourceKey', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.targetKey}
                    onChange={e => handleRowChange(idx, 'targetKey', e.target.value)}
                  />
                </td>
                <td>
                  {row.sourceKey || row.targetKey ? (
                    <button className={styles.deleteButton} onClick={() => handleDelete(idx)}>
                      x
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
