import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiEndpoint } from '@/pages/flow-canvas/types/index';
import { fetchEndpoints } from '@/store/thunks/fetchendpoints';

interface EndpointState {
  endpoints: ApiEndpoint[];
  loading: boolean;
  error?: string;
}

const initialState: EndpointState = {
  endpoints: [],
  loading: false,
};

const endpointSlice = createSlice({
  name: 'endpoint',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEndpoints.pending, state => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchEndpoints.fulfilled, (state, action: PayloadAction<ApiEndpoint[]>) => {
        state.loading = false;
        state.endpoints = action.payload;
      })
      .addCase(fetchEndpoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default endpointSlice.reducer;
