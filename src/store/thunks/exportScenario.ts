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

    const steps: Record<string, FlowStep> = {};

    nodes.forEach(node => {
      const id = node.id;
      const entry = schemaState[id] ?? {};

      const reqFields = sanitizeFieldArray(entry.requestSchema || node.data.requestSchema);
      const resFields = sanitizeFieldArray(entry.responseSchema || node.data.responseSchema);

      const jsonBody = buildJsonBody(reqFields);

      const request = {
        method: node.data.method,
        url: `${node.data.baseUrl}${node.data.path}`,
        header: node.data.header as Record<string, string>,
        body: jsonBody ? { formdata: null, json: jsonBody } : null,
      };

      const routes: FlowRoute[] = edges
        .filter(e => e.source === id)
        .map(e => {
          let pairs: MappingPair[] = Array.isArray((e.data as any)?.mappingInfo)
            ? (e.data as any).mappingInfo
            : [];
          if (pairs.length === 0) {
            const respList = flattenSchema(resFields);
            const reqList = flattenSchema(reqFields);

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

          const expectedValue = pairs.reduce<Record<string, any>>((acc, { sourceKey }) => {
            const leaf = sourceKey.split('.').pop()!;
            const field = resFields.find(f => f.name === leaf);
            if (field?.value !== undefined) {
              acc[leaf] = field.value;
            }
            return acc;
          }, {});

          return {
            expected: {
              status: e.data?.expected?.status ? e.data.expected.status : '200',
              value: Object.keys(expectedValue).length ? expectedValue : null,
            },
            then: {
              store: thenStore,
              step: e.target,
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
      if (!f.name) return acc;
      acc[f.name] = f.value !== undefined ? f.value : null;
      return acc;
    },
    {} as Record<string, any>,
  );
  return Object.keys(obj).length ? JSON.stringify(obj, null, 2) : null;
};
