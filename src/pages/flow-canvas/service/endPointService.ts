import { ApiEndpoint } from '@/pages/flow-canvas/types/index.ts';
import { apiClient } from '@/common/service/apiClient.ts';

export const getEndpointList = async (): Promise<ApiEndpoint[]> => {
  const response: ApiEndpoint[] = await apiClient.get('/apighost/endpoint-json', {});
  return response;
};
