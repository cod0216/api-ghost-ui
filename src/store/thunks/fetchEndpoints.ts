import { createAsyncThunk } from '@reduxjs/toolkit';
import { getEndpointList } from '@/pages/flow-canvas/service/endPointService';
import { ApiEndpoint } from '@/pages/flow-canvas/types';

export const fetchEndpoints = createAsyncThunk<ApiEndpoint[]>(
  'endpoint/fetchEndpoints',
  getEndpointList,
);
