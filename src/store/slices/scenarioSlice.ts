import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScenarioInfo } from '@/pages/flow-canvas/types';

interface ScenarioState {
  list: string[];
  selected: ScenarioInfo | null;
}
const initialState: ScenarioState = { list: [], selected: null };

const scenarioSlice = createSlice({
  name: 'scenario',
  initialState,
  reducers: {
    setScenarioList(state, action: PayloadAction<string[]>) {
      state.list = action.payload;
    },
    selectScenario(state, action: PayloadAction<ScenarioInfo>) {
      state.selected = action.payload;
    },
    clearSelection(state) {
      state.selected = null;
    },
  },
});

export const { setScenarioList, selectScenario, clearSelection } = scenarioSlice.actions;
export default scenarioSlice.reducer;
