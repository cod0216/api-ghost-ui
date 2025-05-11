import { ScenarioInfo, ScenarioNameListResponse } from '@/pages/flow-canvas/types/index.ts';
import { apiClient } from '@/common/service/apiClient.ts';

export const getScenarioList = async (): Promise<string[]> => {
  const response: ScenarioNameListResponse = await apiClient.get('/apighost/scenario-list');
  return response.scenarioNameList;
};

export const getScenarioInfo = async (fileName: string): Promise<ScenarioInfo> => {
  return await apiClient.get('/apighost/scenario-info', {
    scenarioName: fileName,
  });
};

export const exportScenario = async (
  scenario: ScenarioInfo,
): Promise<{
  status: boolean;
}> => {
  return await apiClient.post('/apighost/scenario-export', scenario);
};
