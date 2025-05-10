import FlowCanvas from '@/pages/flow-canvas/FlowCanvas.tsx';
import { fetchEndpoints } from '@/store/thunks/fetchEndpoints';
import { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const FlowCanvasMain = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchEndpoints());
  }, [dispatch]);

  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
};

export default FlowCanvasMain;
