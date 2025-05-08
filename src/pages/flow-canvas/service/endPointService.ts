import { ApiEndpoint } from '@/pages/flow-canvas/types/index.ts';
import { apiClient } from '@/common/service/apiClient.ts';

export const getEndpointList = async (fileName: string): Promise<ApiEndpoint[]> => {
  const response: ApiEndpoint[] = await apiClient.get('/apighost/endpoint-json', {
    scenarioName: fileName,
  });
  return response;
};
