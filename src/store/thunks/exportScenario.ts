import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { ScenarioInfo, FlowStep, FlowRoute } from '@/pages/flow-canvas/types';
import { exportScenario as exportService } from '@/pages/flow-canvas/service/scenarioService';
import { HttpRequest, ProtocolType } from '@/common/types';
import { MappingPair } from '@/pages/flow-canvas/types/mapping';
const DEFAULT_HEADER_OBJ = JSON.stringify({ 'Content-Type': 'application/json' });
const STOMP_METHODS = [
  'CONNECT',
  'DISCONNECT',
  'SEND',
  'SUBSCRIBE',
  'UNSUBSCRIBE',
  'WEBSOCKET',
] as const;

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
      const rawValue = schemaState[id]?.requestSchema ?? node.data.requestSchema;
      let entry: string;

      if (typeof rawValue === 'string') {
        try {
          const parsed = JSON.parse(rawValue);
          entry =
            parsed && typeof parsed === 'object' && typeof (parsed as any).json === 'string'
              ? (parsed as any).json
              : rawValue;
        } catch {
          entry = rawValue;
        }
      } else if (rawValue && typeof rawValue === 'object') {
        const maybeJson = (rawValue as any).json;
        entry =
          typeof maybeJson === 'string' ? maybeJson : JSON.stringify(maybeJson ?? {}, null, 2);
      } else {
        entry = '';
      }

      const headerString = node.data.header?.trim() ? node.data.header : DEFAULT_HEADER_OBJ;

      let headerObj: Record<string, string>;
      try {
        headerObj = JSON.parse(headerString);
      } catch {
        headerObj = {};
      }

      const request: HttpRequest = {
        method: node.data.method,
        url: `${node.data.baseUrl}${node.data.path}`,
        header: headerObj,
        body: entry ? { formdata: null, json: entry } : null,
      };

      const routes: FlowRoute[] = edges
        .filter(e => e.source === id)
        .map(e => {
          const rawExpected = (e.data?.expected?.value as Record<string, any>) ?? {};

          const expectedValue: Record<string, any> = {};
          Object.entries(rawExpected).forEach(([k, v]) => {
            expectedValue[k] = v;
          });

          const pairs: MappingPair[] = Array.isArray((e.data as any)?.mappingInfo)
            ? (e.data as any).mappingInfo
            : [];
          const thenStore: Record<string, any> = {};
          pairs.forEach(({ sourceKey, targetKey }) => {
            if (!sourceKey.toString || !targetKey.toString) return;

            const rawSource = sourceKey.toString();
            const rawTarget = targetKey.toString();

            const leafSource = rawSource.split('.').pop()!;
            const leafTarget = rawTarget.split('.').pop()!;

            let val = leafSource;
            if (!(val.includes('${') && val.includes('}'))) {
              val = `\${${val}}`;
            }

            thenStore[leafTarget] = val;
          });

          return {
            expected: {
              status: e.data?.expected?.status ?? '200',
              value: expectedValue,
            },
            then: {
              store: thenStore,
              step: e.target,
            },
          };
        });

      const method = node.data.method as string;
      const isStomp =
        node.data.type === ProtocolType.WEBSOCKET ||
        STOMP_METHODS.includes(method as (typeof STOMP_METHODS)[number]);

      const protocolType = isStomp ? ProtocolType.WEBSOCKET : ProtocolType.HTTP;

      steps[id] = {
        type: protocolType,
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
