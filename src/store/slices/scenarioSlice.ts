import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScenarioInfo } from '@/pages/flow-canvas/types';

interface ScenarioState {
  list: string[];
  selected: ScenarioInfo | null;
}

const emptyScenario: ScenarioInfo = {
  name: '',
  description: '',
  timeoutMs: 1000,
  store: {},
  steps: {},
};
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
    resetScenarioContent(state) {
      state.selected = emptyScenario;
    },
  },
});

export const { setScenarioList, selectScenario, clearSelection, resetScenarioContent } =
  scenarioSlice.actions;
export default scenarioSlice.reducer;
