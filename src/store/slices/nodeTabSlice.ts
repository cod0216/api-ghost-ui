import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MainTabType, SubTabType } from '@/pages/flow-canvas/types';

interface NodeTabState {
  [nodeId: string]: {
    mainTab: MainTabType;
    subTab: SubTabType;
  };
}

const initialState: NodeTabState = {};

const nodeTabSlice = createSlice({
  name: 'nodeTab',
  initialState,
  reducers: {
    setNodeTab(
      state,
      action: PayloadAction<{
        nodeId: string;
        mainTab: MainTabType;
        subTab: SubTabType;
      }>,
    ) {
      const { nodeId, mainTab, subTab } = action.payload;
      state[nodeId] = { mainTab, subTab };
    },
  },
});

export const { setNodeTab } = nodeTabSlice.actions;
export default nodeTabSlice.reducer;
