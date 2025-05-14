import { configureStore } from '@reduxjs/toolkit';
import endpointReducer from './slices/endpointSlice';
import nodeReducer from './slices/nodeSlice';
import schemaEditorReducer from './slices/schemaEditorSlice';
import flowReducer from './slices/flowSlice';
import nodeTabReducer from './slices/nodeTabSlice';
import scenarioReducer from './slices/scenarioSlice';

export const store = configureStore({
  reducer: {
    endPoint: endpointReducer,
    node: nodeReducer,
    schemaEditor: schemaEditorReducer,
    flow: flowReducer,
    nodeTab: nodeTabReducer,
    scenario: scenarioReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
