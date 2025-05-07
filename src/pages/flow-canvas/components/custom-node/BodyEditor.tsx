import React, { MouseEvent } from 'react';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';
import { useBodyEditorController } from '@/pages/flow-canvas/hooks/useBodyEditorController.ts';
import { BODY_EDITOR_TABS } from '@/pages/flow-canvas/types/bodyEditorTabs.ts';
import { Field } from '@/common/types/index.ts';
import { useBodyEditor } from '@/pages/flow-canvas/hooks/useBodyEditor.ts';

export interface BodyEditorProps {
  requestSchema: Field[];
  responseSchema: Field[];
  onSave: (newSchema: Field[]) => void;
  onClose: () => void;
}
/**
 * BodyEditor component
 * Uses a controller and hook to manage its tab state.
 */
const BodyEditor: React.FC<BodyEditorProps> = ({
  requestSchema,
  responseSchema,
  onSave,
  onClose,
}) => {
  const { mainTab, subTab, availableSubTabs, selectMainTab, selectSubTab } =
    useBodyEditorController(BODY_EDITOR_TABS);
  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  const { currentSchema, updateSchema } = useBodyEditor(requestSchema);
  const handleSave = () => onSave(currentSchema);

  return (
    <div className={styles.editorPopover} onClick={stopPropagation}>
      <nav className={styles.mainTabs}>
        {BODY_EDITOR_TABS.map(group => (
          <button
            key={group.mainTab.label}
            className={`${styles.tab} ${
              mainTab.label === group.mainTab.label ? styles.activeMainTab : ''
            }`}
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
            className={`${styles.tab} ${subTab.label === tab.label ? styles.activeSubTab : ''}`}
            onClick={() => selectSubTab(tab)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className={styles.contentArea}>
        {subTab.showSchema &&
          (mainTab.label === BODY_EDITOR_TABS[0].mainTab.label ? (
            <pre className={styles.schemaContent}>{JSON.stringify(currentSchema, null, 2)}</pre>
          ) : (
            <pre className={styles.schemaContent}>{JSON.stringify(responseSchema, null, 2)}</pre>
          ))}
      </section>

      <footer className={styles.buttonRow}>
        {
          <button className={styles.saveButton} onClick={handleSave}>
            Save
          </button>
        }
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </footer>
    </div>
  );
};

export default BodyEditor;
