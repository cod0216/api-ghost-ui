import { Node, Edge, MarkerType } from 'reactflow';
import { ScenarioTestDetailResponseResult } from '@/pages/dashboard/types/index.ts';
import { ApiRequestData, NodeStatus, Route } from '@/pages/dashboard/types/index.ts';
import { COLORS, FLOW_LAYOUT } from '@/pages/dashboard/constants/colors.ts';

const NODE_SPACING_X = FLOW_LAYOUT.NODE_SPACING_X;
const NODE_SPACING_Y = FLOW_LAYOUT.NODE_SPACING_Y;
const NODE_BASE_Y = FLOW_LAYOUT.NODE_BASE_Y;

const createNode = (
  result: ScenarioTestDetailResponseResult,
  index: number,
): Node<ApiRequestData> => ({
  id: result.stepName,
  type: 'apiRequest',
  position: {
    x: index * NODE_SPACING_X,
    y: NODE_BASE_Y,
  },
  data: {
    ...result,
    isRequestSuccess: result.isRequestSuccess,
  },
  style: {
    borderColor: result.isRequestSuccess ? COLORS.node.border.success : COLORS.node.border.error,
    borderWidth: 2,
    background: result.isRequestSuccess
      ? COLORS.node.background.success
      : COLORS.node.background.error,
  },
});

/**
 * Creates an edge between two nodes, optionally annotating based on failure or route conditions.
 */
const createEdge = (
  sourceId: string,
  targetId: string,
  isConditional: boolean = false,
  expectedCondition?: any,
  isFailurePath: boolean = false,
): Edge => ({
  id: `edge-${sourceId}-${targetId}`,
  source: sourceId,
  target: targetId,
  type: 'smoothstep',
  animated: isFailurePath,
  label: expectedCondition ? `Status ${expectedCondition.status}` : undefined,
  style: {
    stroke: isFailurePath ? COLORS.edge.failureStroke : COLORS.edge.stroke,
    strokeWidth: 2,
    strokeDasharray: isConditional ? '5,5' : undefined,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 15,
    height: 15,
    color: isFailurePath ? COLORS.edge.failureStroke : COLORS.edge.marker,
  },
});

export const buildFlowElements = (
  results: ScenarioTestDetailResponseResult[],
): {
  nodes: Node<ApiRequestData | Route>[];
  edges: Edge[];
} => {
  const nodes: Node<ApiRequestData | Route>[] = [];
  const edges: Edge[] = [];
  const stepIndexMap = new Map<string, number>();
  const addedNodeIds = new Set<string>();

  results.forEach((result, index) => {
    stepIndexMap.set(result.stepName, index);
    if (!addedNodeIds.has(result.stepName)) {
      nodes.push(createNode(result, index));
      addedNodeIds.add(result.stepName);
    }
  });

  results.forEach((result, index) => {
    const sourceId = result.stepName;

    if (result.route && result.route.length > 0) {
      let count = 0;

      result.route.forEach((route, routeIdx) => {
        const nextStepId = route.then?.step;
        if (!nextStepId) return;

        if (!addedNodeIds.has(nextStepId)) {
          nodes.push({
            id: nextStepId,
            type: 'apiRequest',
            position: {
              x: (index + 1) * NODE_SPACING_X,
              y: NODE_BASE_Y + (count++ + 1) * NODE_SPACING_Y,
            },
            data: {
              ...(results.find(r => r.stepName === nextStepId) || route),
            },
          });
          addedNodeIds.add(nextStepId);
        }

        edges.push(
          createEdge(
            sourceId,
            nextStepId,
            true,
            route.expected,
            results.find(r => r.stepName === sourceId)?.isRequestSuccess === false,
          ),
        );
      });
    } else if (result.nextStep && stepIndexMap.has(result.nextStep)) {
      edges.push(createEdge(sourceId, result.nextStep, false, undefined, !result.isRequestSuccess));
    }
  });

  return { nodes, edges };
};

export const getNodeStatusClass = (data: ApiRequestData): NodeStatus =>
  data.isRequestSuccess
    ? NodeStatus.Success
    : data.status
      ? NodeStatus.Error
      : NodeStatus.Unreachable;
