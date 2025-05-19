import { ApiEndpoint } from '@/pages/flow-canvas/types/index.ts';
import { apiClient } from '@/common/service/apiClient.ts';

export const getEndpointList = async (): Promise<ApiEndpoint[]> => {
  const response: ApiEndpoint[] = await apiClient.get('/apighost/endpoint-json', {});
  return response;
};

/**
 * 함수 선언
 *  Axios 요청 ( 상수 : 타입 = 서버 함수()) | await apiClient.get(url, {});
 * 반환환
 */
