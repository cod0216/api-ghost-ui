import React from 'react';
import styles from '@/pages/flow-canvas/styles/MappingModal.module.scss';
import { KeyValue } from '@/pages/flow-canvas/types/mapping';

interface MappingPanelProps {
  label: string;
  method: string;
  path: string;
  baseUrl: string;
  dataList: (KeyValue & { disabled?: boolean })[];
  selectedKeys: string[];
  onToggleKey: (key: string) => void;
  singleSelect?: boolean;
}
const MappingPanel: React.FC<MappingPanelProps> = ({
  label,
  method,
  path,
  baseUrl,
  dataList,
  selectedKeys,
  onToggleKey,
  singleSelect = false,
}) => (
  <div className={styles.panel}>
    <div className={styles.panelHeader}>
      <h2 className={styles.label}>{label}</h2>
      <div className={styles.pathGroup}>
        <div className={styles.methodPathGroup}>
          <span className={`${styles.methodButton} ${styles[`${method}Method`]}`}>{method}</span>
          <span className={styles.pathText}>
            {baseUrl}
            {path}
          </span>
        </div>
      </div>
    </div>
    <table className={styles.table}>
      <thead>
        <tr>
          <th></th>
          <th>Key</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {dataList.map(({ key, type, disabled }) => {
          const checked = selectedKeys.includes(key);
          return (
            <tr key={key} className={disabled ? styles.disabledRow : ''}>
              <td>
                {singleSelect ? (
                  <input
                    type="radio"
                    name={label}
                    disabled={disabled}
                    checked={checked}
                    onChange={() => onToggleKey(key)}
                  />
                ) : (
                  <input
                    type="checkbox"
                    disabled={disabled}
                    checked={checked}
                    onChange={() => onToggleKey(key)}
                  />
                )}
              </td>
              <td>{key}</td>
              <td>{type}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default MappingPanel;
