export enum NodeStatus {
  Success = 'success',
  Error = 'error',
  Unreachable = 'unreachable',
}

export interface ApiRequestData {
  endpoint: string;
  method: string;
  statusCode: number;
  durationMs: number;
  isRequestSuccess: boolean;
}
