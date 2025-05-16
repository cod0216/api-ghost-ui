import { MarkerType } from 'reactflow';
const DEFALUT_EXPECTED = {
  expected: {
    status: '200',
    value: {},
  },
};

export const NODE = {
  ENDPOINT: {
    type: 'endpointNode',
    color: '#6ede87',
  },
  SCENARIO: {
    type: 'scenarioNode',
    color: '#6865A5',
  },
  MOCK: {
    type: 'mockNode',
    color: '#ff0072',
  },
  DEFALULT: {
    type: 'default',
    color: '#ff0072',
  },
} as const;

export const EDGE = {
  FLOW_CANVAS: {
    type: 'flowCanvasEdge',
    defalutExpected: DEFALUT_EXPECTED,
    color: '#25297f',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#25297f' },
  },
  DEFALULT: {},
} as const;
