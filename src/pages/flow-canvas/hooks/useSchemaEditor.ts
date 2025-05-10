import { AppDispatch } from '@/store/index';
import { Field, MainTabType } from '@/pages/flow-canvas/types';
import { setSchema } from '@/store/slices/schemaEditorSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export const useSchemaEditor = (
  nodeId: string,
  initialRequest: Field[],
  initialResponse: Field[],
) => {
  const dispatch = useAppDispatch();
  const entry = useAppSelector(state => state.schemaEditor[nodeId]);
  const requestSchema = entry?.requestSchema ?? initialRequest;
  const responseSchema = entry?.responseSchema ?? initialResponse;

  const save = (type: MainTabType, schema: Field[]) =>
    dispatch(setSchema({ nodeId, type, schema }));

  return { requestSchema, responseSchema, save };
};
