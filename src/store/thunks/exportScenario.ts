import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { ScenarioInfo, FlowStep, FlowRoute } from '@/pages/flow-canvas/types';
import { exportScenario as exportService } from '@/pages/flow-canvas/service/scenarioService';
import { ProtocolType } from '@/common/types';
import { Route } from 'react-router-dom';

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
    console.log('[ExportThunk] nodes:', JSON.stringify(nodes, null, 2));
    console.log('[ExportThunk] edges:', JSON.stringify(edges, null, 2));
    const steps: Record<string, FlowStep> = {};
    nodes.forEach(node => {
      const id = node.id;
      const reqBody = node.data.requestSchema?.length
        ? { formdata: null, json: JSON.stringify(node.data.requestSchema, null, 2) }
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
          const targetNode = nodes.find(n => n.id === e.target);
          return {
            expected: { status: '200', value: null },
            then: {
              store: {},
              step: targetNode ? targetNode.id : '',
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

    console.log('[ExportThunk] full scenario payload:', JSON.stringify(scenario, null, 2));

    try {
      const resp = await exportService(scenario);
      return resp;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
