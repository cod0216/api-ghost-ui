import React, { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import FlowCanvas from './FlowCanvas';
import styles from '@/pages/flow-canvas/styles/FlowCanvasMain.module.scss';
import CommonSidebar from '@/common/components/CommonSidebar';
import ApiList from '@/pages/flow-canvas/components/api-list/ApiList';
import ScenarioList from '@/pages/flow-canvas/components/scenario-list/ScenarioList';
import WelcomePage from '@/pages/flow-canvas/WelcomePage';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectScenario, setList } from '@/store/slices/scenarioSlice';
import { getScenarioInfo, getScenarioList } from '@/pages/flow-canvas/service/scenarioService';

const FlowCanvasMain: React.FC = () => {
  const dispatch = useAppDispatch();
  const scenarios = useAppSelector(state => state.scenario.list);
  const selected = useAppSelector(state => state.scenario.selected);

  const handleSelect = async (name: string) => {
    const info = await getScenarioInfo(name);
    dispatch(selectScenario(info));
  };

  useEffect(() => {
    getScenarioList()
      .then(names => dispatch(setList(names)))
      .catch(err => console.error('[FlowCanvasMain] getScenarioList Error', err));
  }, [dispatch]);

  useEffect(() => {
    console.log('[FlowCanvasMain] selected scenario changed →', selected);
  }, [selected]);

  return (
    <div className={styles.container}>
      <CommonSidebar
        sections={[
          { title: 'API List', content: <ApiList /> },
          {
            title: 'Scenario List',
            content: <ScenarioList scenarios={scenarios} onSelect={handleSelect} />,
          },
        ]}
      />
      <div className={styles.flex}>
        {selected ? (
          <ReactFlowProvider>
            <FlowCanvas />
          </ReactFlowProvider>
        ) : (
          <WelcomePage />
        )}
      </div>
    </div>
  );
};

export default FlowCanvasMain;
