import React, { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { useAppDispatch } from '@/store/hooks';
import { fetchEndpoints } from '@/store/thunks/fetchEndpoints';
import SaveButton from '@/common/components/SaveButton';
import FlowCanvas from './FlowCanvas';
import { useScenario } from '@/pages/flow-canvas/hooks/useScenario';

const FlowCanvasMain: React.FC = () => {
  const dispatch = useAppDispatch();
  const handleSave = useScenario();

  useEffect(() => {
    dispatch(fetchEndpoints());
  }, [dispatch]);

  return (
    <div>
      <SaveButton onSave={handleSave} />
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  );
};

export default FlowCanvasMain;
