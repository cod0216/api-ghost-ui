import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import FlowCanvas from './FlowCanvas';

const FlowCanvasMain: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
};

export default FlowCanvasMain;
