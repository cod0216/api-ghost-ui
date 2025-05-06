export enum NodeStatus {
  Success = 'success',
  Error = 'error',
  Unreachable = 'unreachable',
}

export interface ApiRequestData {
  url: string;
  method: string;
  statusCode: number;
  durationMs: number;
  isRequestSuccess: boolean;
}
