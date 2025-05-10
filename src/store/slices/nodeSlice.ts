import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MainTabType, SubTabType } from '@/pages/flow-canvas/types';

interface NodeState {
  selectedNodeId: string | null;
  activeTab: MainTabType;
}

const initialState: NodeState = {
  selectedNodeId: null,
  activeTab: MainTabType.REQUEST,
};

const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    selectNode(state, action: PayloadAction<string>) {
      state.selectedNodeId = action.payload;
    },
    selectActiveTab(state, action: PayloadAction<MainTabType>) {
      state.activeTab = action.payload;
    },
  },
});

export const { selectNode, selectActiveTab } = nodeSlice.actions;
export default nodeSlice.reducer;
