import { Node, Edge, MarkerType } from 'reactflow';
import { ScenarioTestDetailResponseResult } from '@/common/types/index.ts';
import { ApiRequestData, NodeStatus } from '@/pages/dashboard/types/index.ts';
import { COLORS } from '@/pages/dashboard/constants/colors.ts';

const NODE_SPACING_X = 200;
const NODE_SPACING_Y = 100;
const NODE_BASE_Y = 250;

const createNode = (
  result: ScenarioTestDetailResponseResult,
  index: number,
): Node<ApiRequestData> => ({
  id: `node-${index}`,
  type: 'apiRequest',
  position: {
    x: index * NODE_SPACING_X,
    y: NODE_BASE_Y + (index % 3) * NODE_SPACING_Y,
  },
  data: result,
});

const createEdge = (sourceIndex: number, targetIndex: number): Edge => ({
  id: `edge-${sourceIndex}-${targetIndex}`,
  source: `node-${sourceIndex}`,
  target: `node-${targetIndex}`,
  type: 'smoothstep',
  animated: false,
  style: { stroke: COLORS.edge.stroke, strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 15,
    height: 15,
    color: COLORS.edge.marker,
  },
});

export const buildFlowElements = (
  results: ScenarioTestDetailResponseResult[],
): {
  nodes: Node<ApiRequestData>[];
  edges: Edge[];
} => {
  const nodes = results.map((result, index) => createNode(result, index));
  const edges = results.slice(1).map((_, index) => createEdge(index, index + 1));

  return { nodes, edges };
};

export const getNodeStatusClass = (data: ApiRequestData): NodeStatus =>
  data.isRequestSuccess
    ? NodeStatus.Success
    : data.statusCode
      ? NodeStatus.Error
      : NodeStatus.Unreachable;
