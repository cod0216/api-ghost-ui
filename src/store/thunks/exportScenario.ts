import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { ScenarioInfo, FlowStep, FlowRoute } from '@/pages/flow-canvas/types';
import { exportScenario as exportService } from '@/pages/flow-canvas/service/scenarioService';
import { ProtocolType } from '@/common/types';
import { MappingPair } from '@/pages/flow-canvas/types/mapping';
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
    console.log('[nodes] : ', nodes);
    console.log('[edges] : ', edges);

    const steps: Record<string, FlowStep> = {};

    nodes.forEach(node => {
      console.log('[exportScenario node] : ', node);
      const id = node.id;

      const entry = schemaState[id];
      const finalRequestSchema: Field[] = entry?.requestSchema?.length
        ? entry.requestSchema
        : (node.data.requestSchema ?? []);

      const jsonObj = finalRequestSchema.reduce<Record<string, any>>((acc, f) => {
        if (f.value !== undefined) acc[f.name] = f.value;
        return acc;
      }, {});

      const reqBody = finalRequestSchema.length
        ? {
            formdata: null,
            json: JSON.stringify(jsonObj, null, 2),
          }
        : null;

      const request = {
        method: node.data.method,
        url: `${node.data.baseUrl}${node.data.path}`,
        header: { 'Content-Type': 'application/json' } as Record<string, string>,
        body: reqBody,
      };

      const routes: FlowRoute[] = edges
        .filter(e => e.source === id)
        .map(e => {
          let pairs: MappingPair[] = (e.data as any)?.mappingInfo || [];
          const sourceId = e.source;
          const targetId = e.target;

          const respFields: Field[] =
            schemaState[sourceId]?.responseSchema ??
            nodes.find(n => n.id === sourceId)!.data.responseSchema ??
            [];

          const reqFields: Field[] =
            schemaState[targetId]?.requestSchema ??
            nodes.find(n => n.id === targetId)!.data.requestSchema ??
            [];

          if ((e.data as any)?.mappingInfo?.length === 0) {
            const autoPairs: MappingPair[] = respFields.flatMap(rf =>
              reqFields
                .filter(qf => qf.name === rf.name && qf.type === rf.type)
                .map(qf => ({ sourceKey: rf.name, targetKey: qf.name })),
            );
            pairs = autoPairs;
          }

          const expectedValue = pairs.reduce<Record<string, any>>((acc, { sourceKey }) => {
            const respFields: Field[] =
              schemaState[id]?.responseSchema ?? node.data.responseSchema ?? [];
            const field = respFields.find(f => f.name === sourceKey);
            if (field?.value !== undefined) acc[sourceKey] = field.value;
            return acc;
          }, {});

          const thenStore = pairs.reduce<Record<string, any>>((acc, { sourceKey, targetKey }) => {
            const srcField = finalRequestSchema.find(f => f.name === sourceKey);
            if (srcField?.value !== undefined) acc[targetKey] = srcField.value;
            return acc;
          }, {});

          return {
            expected: {
              status: '200',
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
