import React from 'react';
import styles from '@/pages/flow-canvas/styles/MappingModal.module.scss';
import { KeyValue } from '@/pages/flow-canvas/types/index.ts';

interface MappingPanelProps {
  method: string;
  path: string;
  baseUrl: string;
  label: string;
  dataList: KeyValue[];
  selectedKeys: string[];
  onToggleKey: (key: string) => void;
}

export const MappingPanel: React.FC<MappingPanelProps> = ({
  method,
  path,
  baseUrl,
  label,
  dataList,
  selectedKeys,
  onToggleKey,
}) => {
  const renderKeyValueList = (list: KeyValue[]) => (
    <ul className={styles.list}>
      {list
        .filter(entry => entry.key.toLowerCase() !== 'baseurl')
        .map((entry, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.itemKey}>{entry.key}</span>
            <span className={styles.itemValue}>{entry.value}</span>
          </li>
        ))}
    </ul>
  );

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.pathGroup}>
          <div className={styles.baseUrl}>{baseUrl}</div>
          <div className={styles.methodPathGroup}>
            <span className={`${styles.methodButton} ${styles[`${method}Method`]}`}>{method}</span>
            <span className={styles.pathText}>{path}</span>
          </div>
        </div>
        <h2 className={styles.label}>{label}</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>key</th>
            <th>value</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map(({ key, value }) => (
            <tr key={key}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedKeys.includes(key)}
                  onChange={() => onToggleKey(key)}
                />
              </td>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
