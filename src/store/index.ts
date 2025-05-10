import { configureStore } from '@reduxjs/toolkit';
import endpointReducer from './slices/endpointSlice';
import nodeReducer from './slices/nodeSlice';
import schemaEditorReducer from './slices/schemaEditorSlice';

export const store = configureStore({
  reducer: {
    endPoint: endpointReducer,
    node: nodeReducer,
    schemaEditor: schemaEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
