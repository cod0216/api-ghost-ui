import { useEffect, useState } from 'react';
import {
  getScenarioResultList,
  getScenarioDetailResult,
} from '@/pages/dashboard/service/resultService.ts';
import {
  ScenarioTestResultFileListItem,
  ScenarioTestDetailResponse,
} from '@/pages/dashboard/types/index.ts';

/**
 * Custom hook to handle the fetching and selection of scenario test results.
 */
export const useScenarioFileList = () => {
  const [scenarioFileList, setScenarioFileList] = useState<ScenarioTestResultFileListItem[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioTestDetailResponse | null>(null);

  const fetchSelectedScenario = async (fileName: string | null) => {
    if (!fileName) {
      clearSelectedScenario();
      return;
    }

    try {
      const response = await getScenarioDetailResult(fileName);
      setSelectedScenario(response);
    } catch (err) {
      console.error('[useScenarioFileList] getScenarioDetailResult Error', err);
    }
  };

  useEffect(() => {
    getScenarioResultList()
      .then(setScenarioFileList)
      .catch(err => console.error('[useScenarioFileList] getScenarioResultList Error', err));
  }, []);

  useEffect(() => {
    if (scenarioFileList.length > 0) {
      fetchSelectedScenario(scenarioFileList[0].fileName);
    }
  }, []);

  const clearSelectedScenario = () => {
    setSelectedScenario(null);
  };

  return {
    scenarioFileList,
    selectedScenario,
    fetchSelectedScenario,
    clearSelectedScenario,
  };
};
