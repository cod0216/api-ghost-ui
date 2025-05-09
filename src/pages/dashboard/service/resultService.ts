import { apiClient } from '@/common/service/apiClient.ts';
import {
  ScenarioTestDetailResponse,
  ScenarioTestResultFileListResponse,
  ScenarioTestResultFileListItem,
} from '@/pages/dashboard/types/index.ts';

export const getScenarioResultList = async (): Promise<ScenarioTestResultFileListItem[]> => {
  const response: ScenarioTestResultFileListResponse = await apiClient.get('/apighost/result-list');
  return response.resultList;
};

export const getScenarioDetailResult = async (
  fileName: string,
): Promise<ScenarioTestDetailResponse> => {
  return await apiClient.get<ScenarioTestDetailResponse>('/apighost/result-info', {
    testResultName: fileName,
  });
};
