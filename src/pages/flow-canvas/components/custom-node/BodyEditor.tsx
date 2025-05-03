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
  const { mainTab, subTab, selectMainTab, selectSubTab } = useBodyEditorController();

  const stopCollapse = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.editorPopover} onClick={stopCollapse}>
      <div className={styles.mainTabs}>
        <button
          className={`${styles.tab} ${mainTab === 'request' ? styles.activeMainTab : ''}`}
          onClick={() => selectMainTab('request')}
        >
          Request
        </button>
        <button
          className={`${styles.tab} ${mainTab === 'response' ? styles.activeMainTab : ''}`}
          onClick={() => selectMainTab('response')}
        >
          Response
        </button>
      </div>

      <div className={styles.subTabs}>
        <button
          className={`${styles.tab} ${subTab === 'header' ? styles.activeSubTab : ''}`}
          onClick={() => selectSubTab('header')}
        >
          Header
        </button>

        {mainTab === 'request' && (
          <>
            <button
              className={`${styles.tab} ${subTab === 'body' ? styles.activeSubTab : ''}`}
              onClick={() => selectSubTab('body')}
            >
              Body
            </button>
            <button
              className={`${styles.tab} ${subTab === 'params' ? styles.activeSubTab : ''}`}
              onClick={() => selectSubTab('params')}
            >
              Params
            </button>
          </>
        )}

        {mainTab === 'response' && (
          <button
            className={`${styles.tab} ${subTab === 'body' ? styles.activeSubTab : ''}`}
            onClick={() => selectSubTab('body')}
          >
            Body
          </button>
        )}
      </div>

      <div className={styles.contentArea}>
        {mainTab === 'request' && subTab === 'header' && <div>헤더</div>}
        {mainTab === 'request' && subTab === 'body' && <div>바디</div>}
        {mainTab === 'request' && subTab === 'params' && <div>파람</div>}
        {mainTab === 'response' && subTab === 'header' && <div>헤더</div>}
        {mainTab === 'response' && subTab === 'body' && <div>바디</div>}
      </div>

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
