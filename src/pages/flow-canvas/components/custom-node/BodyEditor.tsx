import React, { MouseEvent } from 'react';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';
import { useBodyEditorController } from '@/pages/flow-canvas/hooks/useBodyEditorController.ts';

export interface BodyEditorProps {
  body: any;
  onSave: (newBody: any) => void;
  onClose: () => void;
}

/**
 * BodyEditor component
 * Uses a controller and hook to manage its tab state.
 */
const BodyEditor: React.FC<BodyEditorProps> = ({ body, onSave, onClose }) => {
  const { mainTab, subTab, availableSubTabs, selectMainTab, selectSubTab } =
    useBodyEditorController();

  const stopCollapse = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const tempContent = () => {
    const key = `${mainTab}_${subTab}` as const;
    const contentMap: Record<string, JSX.Element> = {
      request_header: <div>헤더</div>,
      request_body: <div>바디</div>,
      request_params: <div>파람</div>,
      response_header: <div>헤더</div>,
      response_body: <div>바디</div>,
    };
    return contentMap[key];
  };

  return (
    <div className={styles.editorPopover} onClick={stopCollapse}>
      <div className={styles.mainTabs}>
        {(['request', 'response'] as const).map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${mainTab === tab ? styles.activeMainTab : ''}`}
            onClick={() => selectMainTab(tab)}
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.subTabs}>
        {availableSubTabs.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${subTab === tab ? styles.activeSubTab : ''}`}
            onClick={() => selectSubTab(tab)}
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.contentArea}>{tempContent()}</div>

      <div className={styles.buttonRow}>
        <button className={styles.saveButton} onClick={() => onSave(body)}>
          save
        </button>
        <button className={styles.closeButton} onClick={onClose}>
          close
        </button>
      </div>
    </div>
  );
};

export default BodyEditor;
