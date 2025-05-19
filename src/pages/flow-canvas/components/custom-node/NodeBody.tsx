import React, { MouseEvent, useState, useEffect, useMemo } from 'react';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';
import { useBodyEditorController } from '@/pages/flow-canvas/hooks/useBodyEditorController';
import { BODY_EDITOR_TABS, Tab } from '@/pages/flow-canvas/types/index';
import { MainTabType, SubTabType } from '@/pages/flow-canvas/types';
import RenderJsonSchema from '@/pages/flow-canvas/components/custom-node/RenderJsonSchema';
import RenderHeaderInputTable from './RenderHeaderInputTable';
import JsonToggleField from '@/pages/flow-canvas/components/custom-node/JsonToggleField';

interface NodeBodyProps {
  requestSchema: string;
  responseSchema: string;
  initialMainTabLabel?: MainTabType;
  initialSubTabLabel?: SubTabType;
  onTabChange?: (main: MainTabType, sub: SubTabType) => void;
  onSaveData: (request: string, response: string, newHeader?: string) => void;
  onClose: () => void;
  header?: string;
}

const NodeBody: React.FC<NodeBodyProps> = ({
  requestSchema,
  responseSchema,
  initialMainTabLabel,
  initialSubTabLabel,
  onTabChange,
  onClose,
  onSaveData,
  header = '',
}) => {
  const { mainTab, subTab, availableSubTabs, selectMainTab, selectSubTab } =
    useBodyEditorController(BODY_EDITOR_TABS, initialMainTabLabel, initialSubTabLabel);

  const [reqSchema, setReqSchema] = useState<string>(requestSchema);
  const [resSchema, setResSchema] = useState<string>(responseSchema);
  const [requestHeader, setRequestHeader] = useState<string>(header);

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
    onSaveData(reqSchema, resSchema, requestHeader);
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

      {subTab.label === SubTabType.HEADER && (
        <RenderHeaderInputTable header={requestHeader} onChange={setRequestHeader} />
      )}
      {subTab.showSchema && (
        <section className={styles.contentArea}>
          {isRequestTab ? (
            <JsonToggleField
              initialJson={reqSchema}
              editable={true}
              onChange={setReqSchema}
              className={styles.jsonSchemaField}
            />
          ) : (
            <JsonToggleField
              initialJson={resSchema}
              editable={true}
              onChange={setResSchema}
              className={styles.jsonSchemaField}
            />
          )}
        </section>
      )}

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
