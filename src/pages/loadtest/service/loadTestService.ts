import { apiClient } from '@/common/service/apiClient.ts';
import {
  LoadTestParamName,
  LoadTestParamNameResponse,
  LoadTestParamInfo,
  LoadTestParamExcuteResponse,
  CreateLoadTestRequest,
} from '@/pages/loadtest/types';

export const getLoadTestParamNameList = async (): Promise<LoadTestParamName[]> => {
  const response: LoadTestParamNameResponse = await apiClient.get('/apighost/loadtest-list');
  return response.loadTestParamNameList;
};

export const getLoadTestParamInfo = async (fileName: string): Promise<LoadTestParamInfo> => {
  const response: LoadTestParamInfo = await apiClient.get('/apighost/loadtest-info', {
    loadTestParam: fileName,
  });
  return response;
};
export const createLoadTest = async (request: CreateLoadTestRequest): Promise<boolean> => {
  const response: { success: boolean } = await apiClient.post('/apighost/loadtest-export', request);
  return response.success;
};

export const executeLoadTestParamInfo = async (
  fileName: string,
): Promise<LoadTestParamExcuteResponse> => {
  const response: LoadTestParamExcuteResponse = await apiClient.get('/apighost/loadtest-execute', {
    loadTestParam: fileName,
  }); //scenarioTextResonse
  return response;
};
