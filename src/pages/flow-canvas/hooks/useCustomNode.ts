import { useCallback, MouseEvent } from 'react';
import { useReactFlow } from 'reactflow';
import { Field, NodeEndPoint } from '@/common/types/index.ts';

/**
 * Hook providing toggle and save handlers for a CustomNode.
 * @param id - Node ID to target
 */
export const useNodeControls = (id: string) => {
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
          n.id === id ? { ...n, data: { ...n.data, showBody: !n.data.showBody } } : n,
        ),
      );
    },
    [id, setNodes],
  );

  /**
   * Save a new request schema on the node.
   */
  const saveRequestSchema = useCallback(
    (newSchema: Field[]) => {
      setNodes(nodes =>
        nodes.map(n => (n.id === id ? { ...n, data: { ...n.data, requestSchema: newSchema } } : n)),
      );
    },
    [id, setNodes],
  );

  return { toggleBody, saveRequestSchema };
};
