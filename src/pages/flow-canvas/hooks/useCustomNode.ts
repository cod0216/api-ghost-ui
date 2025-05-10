import { useCallback, MouseEvent } from 'react';
import { useReactFlow } from 'reactflow';
import { Field, NodeEndPoint } from '@/pages/flow-canvas/types/index';

/**
 * Hook providing toggle and save handlers for a CustomNode.
 * @param nodeId - Node ID to target
 * @param endpointId API spac ID
 */
export const useNodeControls = (nodeId: string, endpointId?: string) => {
  const { setNodes } = useReactFlow<NodeEndPoint>();
  /**
   * Toggle the showBody flag on the node.
   * If an event is passed, stop its propagation.
   */
  const toggleBody = useCallback(
    (e?: MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }
      setNodes(nodes =>
        nodes.map(n =>
          n.id === nodeId ? { ...n, data: { ...n.data, showBody: !n.data.showBody } } : n,
        ),
      );
    },
    [nodeId, setNodes],
  );

  /**
   * Save a new request schema on the node.
   */
  const saveRequestSchema = useCallback(
    (newSchema: Field[]) => {
      setNodes(nodes =>
        nodes.map(n =>
          n.id === nodeId ? { ...n, data: { ...n.data, requestSchema: newSchema } } : n,
        ),
      );
    },
    [nodeId, setNodes],
  );

  const saveResponseSchema = useCallback(
    (newSchema: Field[]) => {
      setNodes(nodes =>
        nodes.map(n =>
          n.id === nodeId ? { ...n, data: { ...n.data, responseSchema: newSchema } } : n,
        ),
      );
    },
    [nodeId, setNodes],
  );

  return { toggleBody, saveRequestSchema, saveResponseSchema };
};
