import { createAsyncThunk } from '@reduxjs/toolkit';
import { getLoadTestParamNameList } from '@/pages/loadtest/service/loadTestService';

export const fetchLoadTestFiles = createAsyncThunk('loadTest/fetchAllTests', async () => {
  const data = await getLoadTestParamNameList();
  return data;
});
