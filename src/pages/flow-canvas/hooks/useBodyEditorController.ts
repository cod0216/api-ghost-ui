import { useState, useCallback } from 'react';
import { BodyEditorController } from '@/pages/flow-canvas/controllers/BodyEditorTabsController.ts';
/**
 * Hook to integrate BodyEditorController with React state.
 */
export const useBodyEditorController = () => {
  const [controller] = useState(() => new BodyEditorController());
  const [mainTab, setMainTab] = useState(controller.getMainTab());
  const [subTab, setSubTab] = useState(controller.getSubTab());
  const [availableSubTabs, setAvailableSubTabs] = useState(controller.getAvailableSubTabs());

  const selectMainTab = useCallback(
    (tab: 'request' | 'response') => {
      controller.selectMainTab(tab);
      setMainTab(controller.getMainTab());
      setSubTab(controller.getSubTab());
      setAvailableSubTabs(controller.getAvailableSubTabs());
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
    availableSubTabs,
    selectMainTab,
    selectSubTab,
  };
};
