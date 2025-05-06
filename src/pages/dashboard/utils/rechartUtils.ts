import { Node, Edge, MarkerType } from 'reactflow';
import { ScenarioTestDetailResponseResult } from '@/common/types/index.ts';
import { ApiRequestData, NodeStatus } from '@/pages/dashboard/types/index.ts';
import { COLORS } from '@/pages/dashboard/constants/colors.ts';

const NODE_SPACING_X = 200;
const NODE_SPACING_Y = 100;
const NODE_BASE_Y = 250;

/**
 * Creates a new node for an API request in the flow diagram.
 *
 * @param result - The result object containing the details of the API request.
 * @param index - The index used to calculate the node's position in the flow.
 * @returns A `Node` object representing the API request.
 */
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

/**
 * Creates an edge connecting two nodes in the flow diagram.
 *
 * @param sourceIndex - The index of the source node.
 * @param targetIndex - The index of the target node.
 * @returns An `Edge` object representing the connection between nodes.
 */
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

/**
 * Builds the flow elements consisting of nodes and edges for the API request flow.
 *
 * @param results - An array of `ScenarioTestDetailResponseResult` containing the test results for each API request.
 * @returns An object containing the `nodes` and `edges` to be rendered in the flow diagram.
 */
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

/**
 * Determines the status of a node based on the API request data.
 *
 * @param data - The `ApiRequestData` object representing the data for an API request.
 * @returns A `NodeStatus` value indicating whether the request was successful, erroneous, or unreachable.
 */
export const getNodeStatusClass = (data: ApiRequestData): NodeStatus =>
  data.isRequestSuccess
    ? NodeStatus.Success
    : data.statusCode
      ? NodeStatus.Error
      : NodeStatus.Unreachable;
