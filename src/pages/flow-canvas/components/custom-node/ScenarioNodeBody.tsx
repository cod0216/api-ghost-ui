import React, { MouseEvent, useState, useEffect } from 'react';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';
import { useBodyEditorController } from '@/pages/flow-canvas/hooks/useBodyEditorController';
import { BODY_EDITOR_TABS, Tab } from '@/pages/flow-canvas/types';
import { RequestBody } from '@/common/types';
import { MainTabType, SubTabType } from '@/pages/flow-canvas/types';
import RenderHeaderInputTable from './RenderHeaderInputTable';
import JsonToggleField from './JsonToggleField';

interface ScenarioNodeBodyProps {
  requestSchema: RequestBody;
  responseSchema: string;
  initialMainTabLabel?: MainTabType;
  initialSubTabLabel?: SubTabType;
  onTabChange?: (main: MainTabType, sub: SubTabType) => void;
  onSaveData: (request: RequestBody, response: string, newHeader?: string) => void;
  onClose: () => void;
  header?: string;
}

const ScenarioNodeBody: React.FC<ScenarioNodeBodyProps> = ({
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

  const [requestHeader, setRequestHeader] = useState<string>(header);
  const [reqSchema, setReqSchema] = useState<RequestBody>(requestSchema);
  const [resSchema, setResSchema] = useState<string>(responseSchema);

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

  const updateRequestJson = (updated: string) => {
    setReqSchema(prev => ({ ...prev, json: updated }));
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
          {/* {isRequestTab ? ( */}
          <JsonToggleField
            initialJson={requestSchema?.json ?? ''}
            defaultToJson={true}
            editable={true}
            onChange={updateRequestJson}
          />
          )
          {/* :
           (
            <JsonToggleField
              initialJson={responseSchema}
              defaultToJson={true}
              onChange={setResSchema}
            />
          ) */}
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

export default ScenarioNodeBody;
