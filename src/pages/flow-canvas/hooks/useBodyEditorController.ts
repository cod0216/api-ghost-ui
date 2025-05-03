import { useState, useCallback } from 'react';
import { BodyEditorController } from '@/pages/flow-canvas/controllers/BodyEditorTabsController.ts';
/**
 * Hook to integrate BodyEditorController with React state.
 */
export const useBodyEditorController = () => {
  const [controller] = useState(() => new BodyEditorController());
  const [mainTab, setMainTab] = useState(controller.getMainTab());
  const [subTab, setSubTab] = useState(controller.getSubTab());

  const selectMainTab = useCallback(
    (tab: 'request' | 'response') => {
      controller.selectMainTab(tab);
      setMainTab(controller.getMainTab());
      setSubTab(controller.getSubTab());
    },
    [controller],
  );

  const selectSubTab = useCallback(
    (tab: 'header' | 'body' | 'params') => {
      controller.selectSubTab(tab);
      setSubTab(controller.getSubTab());
    },
    [controller],
  );

  return {
    mainTab,
    subTab,
    selectMainTab,
    selectSubTab,
  };
};
