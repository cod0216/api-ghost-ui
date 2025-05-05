import React, { MouseEvent } from 'react';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';
import { useBodyEditorController } from '@/pages/flow-canvas/hooks/useBodyEditorController.ts';

type MainTab = 'request' | 'response';
type SubTab = 'header' | 'body' | 'params';

type ContentKey =
  | 'request_header'
  | 'request_body'
  | 'request_params'
  | 'response_header'
  | 'response_body';

const MAIN_TABS: MainTab[] = ['request', 'response'];

const CONTENT_MAP: Record<ContentKey, JSX.Element> = {
  request_header: <div>header</div>,
  request_body: <div>body</div>,
  request_params: <div>param</div>,
  response_header: <div>header</div>,
  response_body: <div>body</div>,
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

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

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  const contentKey = `${mainTab}_${subTab}` as ContentKey;
  const content = CONTENT_MAP[contentKey] || <div>no contents</div>;

  return (
    <div className={styles.editorPopover} onClick={stopPropagation}>
      <nav className={styles.mainTabs}>
        {MAIN_TABS.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${mainTab === tab ? styles.activeMainTab : ''}`}
            onClick={() => selectMainTab(tab)}
          >
            {capitalize(tab)}
          </button>
        ))}
      </nav>

      <nav className={styles.subTabs}>
        {availableSubTabs.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${subTab === tab ? styles.activeSubTab : ''}`}
            onClick={() => selectSubTab(tab)}
          >
            {capitalize(tab)}
          </button>
        ))}
      </nav>

      <section className={styles.contentArea}>{content}</section>

      <footer className={styles.buttonRow}>
        <button className={styles.saveButton} onClick={() => onSave(body)}>
          Save
        </button>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </footer>
    </div>
  );
};

export default BodyEditor;
