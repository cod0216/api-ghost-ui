import { configureStore } from '@reduxjs/toolkit';
import endpointReducer from './slices/endpointSlice';
import nodeReducer from './slices/nodeSlice';
import bodyEditorReducer from './slices/bodyEditorReducer';

export const stroe = configureStore({
  reducer: {
    endPoint: endpointReducer,
    node: nodeReducer,
    bodyEditor: bodyEditorReducer,
  },
});
