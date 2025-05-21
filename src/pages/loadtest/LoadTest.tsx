import React, { useState, useEffect } from 'react';
import styles from '@/pages/loadtest/styles/LoadTest.module.scss';
import CommonSidebar from '@/common/components/CommonSidebar';
import { LoadTestParamInfo, LoadTestParamName } from '@/pages/loadtest/types';
import { ScenarioInfo } from '@/pages/flow-canvas/types';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import LoadTestInfo from '@/pages/loadtest/components/chart/LoadTestInfo';

import createIcon from '@/assets/icons/create.svg';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLoadTestFiles, fetchLoadTestInfo } from '@/store/slices/loadtestSlice';

import CreatModal from '@/pages/loadtest/components/create-test/CreatModal';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
);

const LoadTest: React.FC = () => {
  const flowSelected = useAppSelector(state => state.scenario.selected);
  const dispatch = useAppDispatch();
  const loadTestFiles = useAppSelector(state => state.loadTest.files);
  const selectedLoadTest = useAppSelector(state => state.loadTest.selected);

  useEffect(() => {
    dispatch(fetchLoadTestFiles());
  }, []);

  useEffect(() => {
    if (loadTestFiles.length > 0 && !selectedLoadTest) {
      handleSelectItem(loadTestFiles[0]);
    }
  }, [loadTestFiles, selectedLoadTest]);

  useEffect(() => {
    if (loadTestFiles.length === 0) return;

    const targetName = flowSelected ? `${flowSelected.name}.yaml` : '';
    const found = loadTestFiles.find(item => item.fileName === targetName);
    const defaultItem = found ?? loadTestFiles[0];

    handleSelectItem(defaultItem);
  }, [loadTestFiles, flowSelected]);

  const handleSelectItem = (item: LoadTestParamName) => {
    if (!item.fileName) return;
    dispatch(fetchLoadTestInfo(item.fileName));
  };

  const [showModal, setShowModal] = useState<boolean>(false);
  const toggleModal = () => {
    setShowModal(prev => !prev);
  };

  return (
    <div className={styles.container}>
      <CommonSidebar
        className={styles.sidebar}
        sections={[
          {
            content: (
              <>
                <div className={styles.sidebarTitle}>
                  <h4>Load Test</h4>
                  <button className={styles.createButton} onClick={toggleModal}>
                    <img src={createIcon} alt="create Scenario" width={24} height={24} />
                  </button>
                </div>
                <div className={styles.sidebarListContainer}>
                  {loadTestFiles.map(item => {
                    const fileName = item.fileName;
                    const isSelected = item.fileName === selectedLoadTest?.fileName;
                    return (
                      <div
                        key={fileName}
                        className={`${styles.sidebarListItem} ${isSelected ? styles.selectedSidebarListItem : ''}`}
                        title={fileName}
                        onClick={() => handleSelectItem(item)}
                      >
                        {fileName}
                      </div>
                    );
                  })}
                </div>
              </>
            ),
          },
        ]}
      />
      <LoadTestInfo loadTest={selectedLoadTest} />
      {showModal && <CreatModal onCancle={toggleModal} selectedScenario={flowSelected} />}
    </div>
  );
};

export default LoadTest;
