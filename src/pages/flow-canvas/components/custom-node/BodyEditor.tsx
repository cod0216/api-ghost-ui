import React, { MouseEvent } from 'react';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';
import { useBodyEditorController } from '@/pages/flow-canvas/hooks/useBodyEditorController.ts';
import { BODY_EDITOR_TABS } from '@/pages/flow-canvas/types/bodyEditorTabs.ts';

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
    useBodyEditorController(BODY_EDITOR_TABS);

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  return (
    <div className={styles.editorPopover} onClick={stopPropagation}>
      <nav className={styles.mainTabs}>
        {BODY_EDITOR_TABS.map(group => (
          <button
            key={group.mainTab.label}
            className={`${styles.tab} ${mainTab.label === group.mainTab.label ? styles.activeMainTab : ''}`}
            onClick={() => selectMainTab(group.mainTab)}
          >
            {group.mainTab.label}
          </button>
        ))}
      </nav>

      <nav className={styles.subTabs}>
        {availableSubTabs.map(tab => (
          <button
            key={tab.label}
            className={`${styles.tab} ${subTab === tab ? styles.activeSubTab : ''}`}
            onClick={() => selectSubTab(tab)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className={styles.contentArea}>{subTab.label}</section>

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
