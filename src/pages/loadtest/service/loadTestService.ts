import { apiClient } from '@/common/service/apiClient.ts';
import {
  LoadTestParamName,
  LoadTestParamNameResponse,
  LoadTestParamInfo,
  LoadTestParamExcuteResponse,
  CreateLoadTestRequest,
} from '@/pages/loadtest/types';

// 부하테스트 파일 목록 조회
export const getLoadTestParamNameList = async (): Promise<LoadTestParamName[]> => {
  const response: LoadTestParamNameResponse = await apiClient.get('/apighost/loadtest-list');
  return response.loadTestParamNameList;
};

// 부하 테스트 파일 상세 조회
export const getLoadTestParamInfo = async (fileName: string): Promise<LoadTestParamInfo> => {
  const response: LoadTestParamInfo = await apiClient.get('/apighost/loadtest-info', {
    loadTestParam: fileName,
  });
  return response;
};

//파일생성
export const createLoadTest = async (request: CreateLoadTestRequest): Promise<boolean> => {
  const response: { success: boolean } = await apiClient.post('/apighost/loadtest-export', request);
  return response.success;
};

///apighost/loadtest-execute 실행, SSE
export const executeLoadTestParamInfo = async (
  fileName: string,
): Promise<LoadTestParamExcuteResponse> => {
  const response: LoadTestParamExcuteResponse = await apiClient.get('/apighost/loadtest-execute', {
    loadTestParam: fileName,
  }); //scenarioTextResonse
  return response;
};
