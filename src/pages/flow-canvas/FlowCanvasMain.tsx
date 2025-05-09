import FlowCanvas from '@/pages/flow-canvas/FlowCanvas.tsx';
import { ReactFlowProvider } from 'reactflow';

const FlowCanvasMain = () => {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
};

export default FlowCanvasMain;
