import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { LoadTestParamInfo, LoadTestParamName } from '@/pages/loadtest/types';
import {
  getLoadTestParamInfo,
  getLoadTestParamNameList,
} from '@/pages/loadtest/service/loadTestService';

interface LoadTestState {
  files: LoadTestParamName[];
  selected: LoadTestParamInfo | null;
}

const initialState: LoadTestState = {
  files: [],
  selected: null,
};

export const fetchLoadTestFiles = createAsyncThunk(
  'loadTest/fetchFiles',
  async () => await getLoadTestParamNameList(),
);

export const fetchLoadTestInfo = createAsyncThunk(
  'loadTest/fetchInfo',
  async (fileName: string) => await getLoadTestParamInfo(fileName),
);

const loadTestSlice = createSlice({
  name: 'loadTest',
  initialState,
  reducers: {
    setSelectedLoadTest(state, action: PayloadAction<LoadTestParamInfo>) {
      state.selected = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLoadTestFiles.fulfilled, (state, action) => {
        state.files = action.payload;
      })

      .addCase(fetchLoadTestInfo.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  },
});

export const { setSelectedLoadTest } = loadTestSlice.actions;
export default loadTestSlice.reducer;
