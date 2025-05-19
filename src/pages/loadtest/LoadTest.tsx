import React, { useState, useEffect } from 'react';
import styles from '@/pages/loadtest/styles/LoadTest.module.scss';
import CommonSidebar from '@/common/components/CommonSidebar';
import { LoadTestParamInfo, LoadTestParamName } from '@/pages/loadtest/types';
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
import {
  getLoadTestParamInfo,
  getLoadTestParamNameList,
} from '@/pages/loadtest/service/loadTestService';
import createIcon from '@/assets/icons/create.svg';

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
  const [loadTestFiles, setLoadTestFiles] = useState<LoadTestParamName[]>([]);
  const [selectedLoadTest, setSelectedLoadTest] = useState<LoadTestParamInfo | null>(null);

  useEffect(() => {
    const load = async () => {
      await getLoadTestParamNameList()
        .then(files => setLoadTestFiles(files))
        .catch(err => console.error('[LoadTest] getLoadTestParamNameList Error', err));
    };
    load();
  }, []);

  useEffect(() => {
    if (loadTestFiles.length == 0 || selectedLoadTest) return;
    handleSelectItem(loadTestFiles[0]);
  }, [loadTestFiles]);

  const handleSelectItem = (item: LoadTestParamName) => {
    const fileName = item.fileName;
    if (!fileName) return;
    const load = async () => {
      await getLoadTestParamInfo(fileName)
        .then(setSelectedLoadTest)
        .catch(e => {
          console.error(e);
        });
    };
    load();
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
      {showModal && <CreatModal onCancle={toggleModal} />}
    </div>
  );
};

export default LoadTest;
