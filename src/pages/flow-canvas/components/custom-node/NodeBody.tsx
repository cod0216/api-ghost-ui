import React, { MouseEvent, useState, useEffect } from 'react';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';
import { useBodyEditorController } from '@/pages/flow-canvas/hooks/useBodyEditorController';
import { BODY_EDITOR_TABS, Path, Tab } from '@/pages/flow-canvas/types/index';
import { Field, MainTabType, SubTabType } from '@/pages/flow-canvas/types';
import { useBodyEditor } from '@/pages/flow-canvas/hooks/useBodyEditor';
import RenderJsonSchema from '@/pages/flow-canvas/components/custom-node/RenderJsonSchema';

interface NodeBodyProps {
  requestSchema: Field[];
  responseSchema: Field[];
  initialMainTabLabel?: MainTabType;
  initialSubTabLabel?: SubTabType;
  onTabChange?: (main: MainTabType, sub: SubTabType) => void;
  onSaveRequestSchema: (newSchema: Field[]) => void;
  onSaveResponseSchema: (newSchema: Field[]) => void;
  onClose: () => void;
}

const NodeBody: React.FC<NodeBodyProps> = ({
  requestSchema,
  responseSchema,
  initialMainTabLabel,
  initialSubTabLabel,
  onTabChange,
  onSaveRequestSchema,
  onSaveResponseSchema,
  onClose,
}) => {
  const { mainTab, subTab, availableSubTabs, selectMainTab, selectSubTab } =
    useBodyEditorController(BODY_EDITOR_TABS, initialMainTabLabel, initialSubTabLabel);

  const { currentSchema: reqSchema, updateSchema: setReqSchema } = useBodyEditor(requestSchema);
  const { currentSchema: resSchema, updateSchema: setResSchema } = useBodyEditor(responseSchema);

  useEffect(() => {
    setReqSchema(requestSchema);
  }, [JSON.stringify(requestSchema)]);

  useEffect(() => {
    setResSchema(responseSchema);
  }, [JSON.stringify(responseSchema)]);

  const isRequestTab = mainTab.label === BODY_EDITOR_TABS[0].mainTab.label;

  const handleMainTab = (tab: Tab) => {
    selectMainTab(tab);
    if (onTabChange) onTabChange(tab.label as MainTabType, subTab.label as SubTabType);
  };

  const handleSubTab = (tab: Tab) => {
    selectSubTab(tab);
    if (onTabChange) onTabChange(mainTab.label as MainTabType, tab.label as SubTabType);
  };

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  const handleSave = () => {
    if (isRequestTab) onSaveRequestSchema(reqSchema);
    else {
      onSaveResponseSchema(resSchema);
    }
    onClose();
  };

  return (
    <div className={styles.editorPopover} onClick={stopPropagation}>
      <nav className={styles.mainTabs}>
        {BODY_EDITOR_TABS.map(group => (
          <button
            key={group.mainTab.label}
            className={`${styles.tab} ${
              mainTab.label === group.mainTab.label ? styles.activeMainTab : ''
            }`}
            onClick={() => handleMainTab(group.mainTab)}
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
            onClick={() => handleSubTab(tab)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className={styles.contentArea}>
        {subTab.showSchema && isRequestTab && (
          <RenderJsonSchema
            data={reqSchema}
            indent={0}
            onChange={updated => setReqSchema(updated)}
          />
        )}
        {subTab.showSchema && !isRequestTab && (
          <RenderJsonSchema
            data={resSchema}
            indent={0}
            onChange={updated => setResSchema(updated)}
          />
        )}
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

export default NodeBody;
