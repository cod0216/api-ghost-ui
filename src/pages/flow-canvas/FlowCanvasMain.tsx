import React, { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { useAppDispatch } from '@/store/hooks';
import { fetchEndpoints } from '@/store/thunks/fetchEndpoints';
import SaveButton from '@/common/components/SaveButton';
import FlowCanvas from './FlowCanvas';
import { useScenario } from '@/pages/flow-canvas/hooks/useScenario';
import PlayButton from '@/common/components/playButton';

const FlowCanvasMain: React.FC = () => {
  return (
    <div>
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  );
};

export default FlowCanvasMain;
