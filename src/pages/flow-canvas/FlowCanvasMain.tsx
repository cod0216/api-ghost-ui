import React, { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import FlowCanvas from './FlowCanvas';
import styles from '@/pages/flow-canvas/styles/FlowCanvasMain.module.scss';
import CommonSidebar from '@/common/components/CommonSidebar';
import ApiList from '@/pages/flow-canvas/components/api-list/ApiList';
import ScenarioList from '@/pages/flow-canvas/components/scenario-list/ScenarioList';
import WelcomePage from '@/pages/flow-canvas/WelcomePage';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectScenario, setScenarioList } from '@/store/slices/scenarioSlice';
import { getScenarioInfo, getScenarioList } from '@/pages/flow-canvas/service/scenarioService';
import { useScenario } from '@/pages/flow-canvas/hooks/useScenario';
import foldIcon from '@/assets/icons/fold.svg';
import deleteIcon from '@/assets/icons/delete.svg';
import createIcon from '@/assets/icons/create.svg';

const FlowCanvasMain: React.FC = () => {
  const dispatch = useAppDispatch();
  const scenarios = useAppSelector(state => state.scenario.list);
  const selected = useAppSelector(state => state.scenario.selected);
  const { autoSave, removeScenario, createScenario } = useScenario();

  const handleSelect = async (name: string) => {
    if (selected) {
      const ok = await autoSave(selected);
    }
    const info = await getScenarioInfo(name);
    console.log('newFile Name: ', name);
    dispatch(selectScenario(info));
  };

  const handleRemove = async (name: string) => {
    if (selected?.name === name) {
      removeScenario();
    } else {
      alert('select file first');
      return;
    }
  };

  useEffect(() => {
    const initFlow = async () => {
      await getScenarioList()
        .then(names => dispatch(setScenarioList(names)))
        .catch(err => console.error('[FlowCanvasMain] getScenarioList Error', err));
    };
    initFlow();
  }, [dispatch]);

  return (
    <ReactFlowProvider>
      <div className={styles.container}>
        <CommonSidebar
          className={styles.sidebarMargin}
          headerIcon={foldIcon}
          sections={[
            { title: 'API List', content: <ApiList /> },
            {
              titleComponent: (
                <div className={styles.sectionTitleWithAction}>
                  <h4>Scenario List</h4>
                  <div className={styles.buttonGroup}>
                    <button className={styles.createButton} onClick={() => createScenario()}>
                      <img src={createIcon} alt="create Scenario" width={24} height={24} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleRemove(selected?.name ?? '')}
                      disabled={!selected}
                    >
                      <img src={deleteIcon} alt="delete Scenario" width={24} height={24} />
                    </button>
                  </div>
                </div>
              ),
              content: (
                <ScenarioList
                  scenarios={scenarios}
                  selectedScenario={(selected?.name ?? '') + '.yaml'}
                  onSelect={handleSelect}
                />
              ),
            },
          ]}
        />
        <div className={styles.flex}>{selected ? <FlowCanvas /> : <WelcomePage />}</div>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowCanvasMain;
