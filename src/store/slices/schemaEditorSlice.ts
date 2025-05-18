import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MainTabType } from '@/pages/flow-canvas/types';

type SchemaEntry = {
  requestSchema: string;
  responseSchema: string;
};

type SchemaState = Record<string, SchemaEntry>;

const schemaEditorSlice = createSlice({
  name: 'schemaEditor',
  initialState: {} as SchemaState,
  reducers: {
    setSchema(
      state,
      action: PayloadAction<{
        nodeId: string;
        type: MainTabType;
        schema: string;
      }>,
    ) {
      const { nodeId, type, schema } = action.payload;
      if (!state[nodeId]) {
        state[nodeId] = { requestSchema: '{}', responseSchema: '{}' };
      }

      const key = type === MainTabType.REQUEST ? 'requestSchema' : 'responseSchema';
      state[nodeId][key] = schema;
    },
    clearSchema(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});

export const { setSchema, clearSchema } = schemaEditorSlice.actions;
export default schemaEditorSlice.reducer;
