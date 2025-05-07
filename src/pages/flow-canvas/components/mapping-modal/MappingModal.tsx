import React, { useState } from 'react';
import styles from '@/pages/flow-canvas/styles/MappingModal.module.scss';
import { MappingPanel } from './MappingPanel';
import { KeyValue, MappingPair, MappingPanelConfig } from '@/pages/flow-canvas/types/index.ts';
import { useMappingSelection } from '@/pages/flow-canvas/hooks/useMappingSelection';
export interface MappingModalProps {
  isVisible: boolean;
  modalTitle?: string;
  panelLabels?: [string, string];
  leftEndpointTitle: string;
  rightEndpointTitle: string;
  leftKeyValueList: KeyValue[];
  rightKeyValueList: KeyValue[];
  leftEndpointBaseUrl: string;
  rightEndpointBaseUrl: string;
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
  onConfirm,
  onDismiss,
}) => {
  if (!isVisible) {
    return null;
  }

  const [leftHttpMethod, ...leftTitleParts] = leftEndpointTitle.split(' ');
  const leftEndpointPath = leftTitleParts.join(' ');

  const [rightHttpMethod, ...rightTitleParts] = rightEndpointTitle.split(' ');
  const rightEndpointPath = rightTitleParts.join(' ');

  const { leftSelectedKeys, rightSelectedKeys, toggleLeftKey, toggleRightKey, clearSelection } =
    useMappingSelection();

  const handleSave = () => {
    const mappingPairs: MappingPair[] = leftSelectedKeys.flatMap(sourceKey =>
      rightSelectedKeys.map(targetKey => ({ sourceKey, targetKey })),
    );
    onConfirm(mappingPairs);
    clearSelection();
  };

  const panels: MappingPanelConfig[] = [
    {
      endpointTitle: leftEndpointTitle,
      baseUrl: leftEndpointBaseUrl,
      dataList: leftKeyValueList,
      selectedKeys: leftSelectedKeys,
      onToggleKey: toggleLeftKey,
      label: panelLabels[0],
    },
    {
      endpointTitle: rightEndpointTitle,
      baseUrl: rightEndpointBaseUrl,
      dataList: rightKeyValueList,
      selectedKeys: rightSelectedKeys,
      onToggleKey: toggleRightKey,
      label: panelLabels[1],
    },
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 className={styles.title}>{modalTitle}</h2>
        </header>

        <div className={styles.panels}>
          {panels.map(({ endpointTitle, baseUrl, dataList, selectedKeys, onToggleKey, label }) => {
            const [method, ...parts] = endpointTitle.split(' ');
            const path = parts.join(' ');
            return (
              <MappingPanel
                key={label}
                method={method}
                path={path}
                baseUrl={baseUrl}
                label={label}
                dataList={dataList}
                selectedKeys={selectedKeys}
                onToggleKey={onToggleKey}
              />
            );
          })}
        </div>

        <footer className={styles.buttonRow}>
          <button className={styles.saveButton} onClick={handleSave}>
            Save
          </button>
          <button
            className={styles.cancelButton}
            onClick={() => {
              clearSelection();
              onDismiss();
            }}
          >
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};
