import { apiClient } from '@/common/service/apiClient';
import { GenerateDataRequest, GenerateDataReponse } from '@/pages/flow-canvas/types';

export const getnergateData = async (
  payload: GenerateDataRequest,
): Promise<GenerateDataReponse> => {
  return apiClient.post<GenerateDataReponse>('/apighost/generate-data', payload);
};
