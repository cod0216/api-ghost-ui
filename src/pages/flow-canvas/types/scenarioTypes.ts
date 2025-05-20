import { HttpRequest, ProtocolType } from '@/common/types/index.ts';

export interface ScenarioNameListResponse {
  scenarioNameList: string[];
}

export interface ScenarioInfoResponse {
  fileName: string;
  file: ScenarioInfo;
}

export interface ScenarioInfo {
  name: string;
  description: string;
  timeoutMs: number;
  store: Record<string, any> | null;
  steps: Record<string, FlowStep>;
}

export interface FlowStep {
  type: ProtocolType;
  position: {
    x: number;
    y: number;
  };
  request: HttpRequest;
  route: FlowRoute[];
}

export interface FlowRoute {
  expected: {
    status: string;
    value?: Record<string, any> | null;
  };
  then: {
    store: Record<string, any>;
    step: string;
  };
}

export enum TestStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  COMPLETE = 'complete',
}
