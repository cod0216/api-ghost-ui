import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { ScenarioInfo, FlowStep, FlowRoute } from '@/pages/flow-canvas/types';
import { exportScenario as exportService } from '@/pages/flow-canvas/service/scenarioService';
import { ProtocolType } from '@/common/types';
import { MappingPair } from '@/pages/flow-canvas/types/mapping';
import { flattenSchema } from '@/common/utils/schemaUtils';
import { Field } from '@/pages/flow-canvas/types';

interface Payload {
  name: string;
  description: string;
  timeoutMs: number;
}

export const exportScenario = createAsyncThunk(
  'scenario/export',
  async (meta: Payload, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { nodes, edges } = state.flow;

    const schemaState = state.schemaEditor;
    console.log(
      edges.map(e => ({
        id: e.id,
        mappingInfo: (e.data as any)?.mappingInfo ?? null,
      })),
    );

    const steps: Record<string, FlowStep> = {};

    nodes.forEach(node => {
      const id = node.id;
      const entry = schemaState[id];

      const rawSchema = entry?.requestSchema ?? node.data.requestSchema;
      const finalRequestSchema: Field[] = Array.isArray(rawSchema) ? rawSchema : [];
      const jsonObj = finalRequestSchema.reduce(
        (acc: Record<string, any>, f: Field) => {
          if (f && f.name && f.value !== undefined) acc[f.name] = f.value;
          return acc;
        },
        {} as Record<string, any>,
      );
      const reqBody = finalRequestSchema.length
        ? { formdata: null, json: JSON.stringify(jsonObj, null, 2) }
        : null;

      const request = {
        method: node.data.method,
        url: `${node.data.baseUrl}${node.data.path}`,
        header: node.data.header as Record<string, string>,
        body: reqBody,
      };

      const routes: FlowRoute[] = edges
        .filter(e => e.source === id)
        .map(e => {
          const sourceId = e.source;
          const targetId = e.target;
          let pairs: MappingPair[] = (e.data as any)?.mappingInfo || [];
          if (pairs.length === 0) {
            const respList = flattenSchema(
              nodes.find(n => n.id === sourceId)!.data.responseSchema ?? [],
            );
            const reqList = flattenSchema(
              nodes.find(n => n.id === targetId)!.data.requestSchema ?? [],
            );
            pairs = respList.flatMap(rk =>
              reqList
                .filter(qk => qk.key.split('.').pop() === rk.key.split('.').pop())
                .map(qk => ({ sourceKey: rk.key, targetKey: qk.key })),
            );
          }
          const thenStore: Record<string, string> = {};
          pairs.forEach(({ sourceKey, targetKey }) => {
            const sourceLeaf = sourceKey.split('.').pop()!;
            const targetLeaf = targetKey.split('.').pop()!;
            thenStore[targetLeaf] = sourceLeaf;
          });

          const respFields =
            schemaState[sourceId]?.responseSchema ?? node.data.responseSchema ?? [];
          const expectedValue = pairs.reduce<Record<string, any>>((acc, { sourceKey }) => {
            const leaf = sourceKey.split('.').pop()!;
            const field = respFields.find(f => f.name === leaf);
            if (field?.value !== undefined) acc[leaf] = field.value;
            return acc;
          }, {});

          return {
            expected: {
              status: e.data?.expected?.status ? e.data.expected.status : '200',
              value: Object.keys(expectedValue).length ? expectedValue : null,
            },
            then: {
              store: thenStore,
              step: targetId,
            },
          };
        });

      steps[id] = {
        type: ProtocolType.HTTP,
        position: { x: node.position.x, y: node.position.y },
        request,
        route: routes,
      };
    });

    const scenario: ScenarioInfo = {
      name: meta.name,
      description: meta.description,
      timeoutMs: meta.timeoutMs,
      store: null,
      steps,
    };

    try {
      const resp = await exportService(scenario);
      return resp;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const sanitizeFieldArray = (fields: unknown): Field[] => {
  return Array.isArray(fields) ? fields.filter(f => f && typeof f.name === 'string') : [];
};

const buildJsonBody = (fields: Field[]): string | null => {
  const obj = fields.reduce(
    (acc, f) => {
      if (f.name && f.value !== undefined) acc[f.name] = f.value;
      return acc;
    },
    {} as Record<string, any>,
  );
  return Object.keys(obj).length ? JSON.stringify(obj, null, 2) : null;
};
