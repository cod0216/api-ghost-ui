import { useCallback, MouseEvent } from 'react';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas';

/**
 * Hook providing toggle and save handlers for a CustomNode.
 * @param nodeId - Node ID to target
 * @param endpointId API spac ID
 */
export const useNodeControls = (nodeId: string, endpointId?: string) => {
  const { setNodes } = useFlowCanvas();
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
    (newSchema: string) => {
      setNodes(nodes =>
        nodes.map(n =>
          n.id === nodeId ? { ...n, data: { ...n.data, requestSchema: newSchema } } : n,
        ),
      );
    },
    [nodeId, setNodes],
  );

  const saveResponseSchema = useCallback(
    (newSchema: string) => {
      setNodes(nodes =>
        nodes.map(n =>
          n.id === nodeId ? { ...n, data: { ...n.data, responseSchema: newSchema } } : n,
        ),
      );
    },
    [nodeId, setNodes],
  );

  const savePath = useCallback(
    (newPath: string) => {
      setNodes(nodes =>
        nodes.map(n => (n.id === nodeId ? { ...n, data: { ...n.data, path: newPath } } : n)),
      );
    },
    [nodeId, setNodes],
  );

  return { toggleBody, saveRequestSchema, saveResponseSchema, savePath };
};
