import React, { useEffect, useState } from 'react';
import styles from '@/pages/flow-canvas/styles/MappingModal.module.scss';
import MappingPanel from './MappingPanel';
import { KeyValue, MappingPair } from '@/pages/flow-canvas/types/index.ts';
import { CommonButton } from '@/common/components/CommonButton';

interface MappingModalProps {
  isVisible: boolean;
  modalTitle?: string;
  panelLabels?: [string, string];
  leftEndpointTitle: string;
  rightEndpointTitle: string;
  leftKeyValueList: KeyValue[];
  rightKeyValueList: KeyValue[];
  leftEndpointBaseUrl: string;
  rightEndpointBaseUrl: string;
  leftSelectedKey: string | null;
  rightSelectedKey: string | null;
  mappingInfo: MappingPair[];
  onConfirm: (mappingPairs: MappingPair[]) => void;
  onDismiss: () => void;
}

export const MappingModal: React.FC<MappingModalProps> = ({
  isVisible,
  modalTitle = 'Mapping',
  panelLabels = ['Response', 'Request'],
  leftEndpointTitle,
  rightEndpointTitle,
  leftKeyValueList,
  rightKeyValueList,
  leftEndpointBaseUrl,
  rightEndpointBaseUrl,
  leftSelectedKey,
  rightSelectedKey,
  mappingInfo,
  onConfirm,
  onDismiss,
}) => {
  const [leftKey, setLeftKey] = useState<string | null>(leftSelectedKey);
  const [rightKey, setRightKey] = useState<string | null>(rightSelectedKey);

  // useEffect(() => {
  //   setLeftSelectedKeys(leftSelectedKey ? [leftSelectedKey] : []);
  //   setRightSelectedKeys(rightSelectedKey ? [rightSelectedKey] : []);
  // }, [isVisible, leftSelectedKey, rightSelectedKey]);

  if (!isVisible) return null;
  const toggleLeftKey = (key: string) => {
    // 기존에 매핑된 requestKey를 찾아 자동 선택
    const mapped = (mappingInfo ?? []).find(p => p.sourceKey === key)?.targetKey;
    setLeftKey(key);
    setRightKey(mapped ?? null);
  };
  const toggleRightKey = (key: string) => setRightKey(key);

  const handleSave = () => {
    if (!leftKey || !rightKey) return;
    onConfirm([{ sourceKey: leftKey, targetKey: rightKey }]);
  };
  const [leftMethod, ...leftParts] = leftEndpointTitle.split(' ');
  const [rightMethod, ...rightParts] = rightEndpointTitle.split(' ');

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{modalTitle}</h2>
        </div>
        <div className={styles.mappingPanel}>
          <MappingPanel
            label={panelLabels[0]}
            method={leftMethod}
            path={leftParts.join(' ')}
            baseUrl={leftEndpointBaseUrl}
            dataList={leftKeyValueList}
            selectedKeys={leftKey ? [leftKey] : []}
            onToggleKey={toggleLeftKey}
            singleSelect={true}
          />

          <MappingPanel
            label={panelLabels[1]}
            method={rightMethod}
            path={rightParts.join(' ')}
            baseUrl={rightEndpointBaseUrl}
            dataList={rightKeyValueList}
            selectedKeys={rightKey ? [rightKey] : []}
            onToggleKey={toggleRightKey}
            singleSelect={true}
          />
        </div>
        <CommonButton onConfirm={handleSave} onCancel={onDismiss} />
      </div>
    </div>
  );
};
