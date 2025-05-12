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
  onConfirm,
  onDismiss,
}) => {
  const [leftSelectedKeys, setLeftSelectedKeys] = useState<string[]>(
    leftSelectedKey ? [leftSelectedKey] : [],
  );
  const [rightSelectedKeys, setRightSelectedKeys] = useState<string[]>(
    rightSelectedKey ? [rightSelectedKey] : [],
  );

  // useEffect(() => {
  //   setLeftSelectedKeys(leftSelectedKey ? [leftSelectedKey] : []);
  //   setRightSelectedKeys(rightSelectedKey ? [rightSelectedKey] : []);
  // }, [isVisible, leftSelectedKey, rightSelectedKey]);

  if (!isVisible) return null;

  const toggleLeftKey = (key: string) => {
    setLeftSelectedKeys([key]);
  };

  const toggleRightKey = (key: string) => {
    setRightSelectedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  };

  const handleSave = () => {
    const mappingPairs: MappingPair[] = leftSelectedKeys.flatMap(sourceKey =>
      rightSelectedKeys.map(targetKey => ({ sourceKey, targetKey })),
    );
    onConfirm(mappingPairs);
    setLeftSelectedKeys([]);
    setRightSelectedKeys([]);
  };

  const [leftMethod, ...leftParts] = leftEndpointTitle.split(' ');
  const leftPath = leftParts.join(' ');
  const [rightMethod, ...rightParts] = rightEndpointTitle.split(' ');
  const rightPath = rightParts.join(' ');

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
            path={leftPath}
            baseUrl={leftEndpointBaseUrl}
            dataList={leftKeyValueList}
            selectedKeys={leftSelectedKeys}
            onToggleKey={toggleLeftKey}
          />

          <MappingPanel
            label={panelLabels[1]}
            method={rightMethod}
            path={rightPath}
            baseUrl={rightEndpointBaseUrl}
            dataList={rightKeyValueList}
            selectedKeys={rightSelectedKeys}
            onToggleKey={toggleRightKey}
          />
        </div>
        <CommonButton
          onConfirm={handleSave}
          onCancel={() => {
            setLeftSelectedKeys([]);
            setRightSelectedKeys([]);
            onDismiss();
          }}
        />
      </div>
    </div>
  );
};
