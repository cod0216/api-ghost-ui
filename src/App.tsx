import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import FlowCanvas from '@/pages/flow-canvas/FlowCanvas.tsx';

const App: React.FC = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  </div>
);

export default App;
