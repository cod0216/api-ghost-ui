/**
 * @fileoverview
 * Custom React hook that integrates the BodyEditorController with component state
 * to manage main and sub tab selection for the BodyEditor UI.
 */
import { useState, useCallback, useMemo } from 'react';
import { BodyEditorController } from '@/pages/flow-canvas/controllers/BodyEditorTabsController.ts';
import { CombineTab, Tab } from '@/pages/flow-canvas/types/bodyEditorTabs.ts';

export const useBodyEditorController = (tabs: readonly CombineTab[]) => {
  const [controller] = useState(() => new BodyEditorController(tabs));
  const [mainTab, setMainTab] = useState<Tab>(controller.getMainTab()); //Tab
  const [subTab, setSubTab] = useState<Tab>(controller.getSubTab());
  const allowedMap = useMemo(
    () =>
      tabs.reduce<Record<string, Tab[]>>((acc, { mainTab, subTabs }) => {
        acc[mainTab.label] = subTabs;
        return acc;
      }, {}),
    [tabs],
  );

  const [availableSubTabs, setAvailableSubTabs] = useState<Tab[]>(allowedMap[mainTab.label] || []);
  /**
   * Select a new main tab, update controller, state, and derived sub tabs.
   *
   */
  const selectMainTab = useCallback(
    (tab: Tab): void => {
      controller.selectMainTab(tab);
      setMainTab(tab);

      const subs = allowedMap[tab.label] || [];
      setAvailableSubTabs(subs);

      const lastSub = controller.getSubTab();
      setSubTab(lastSub);
    },
    [controller, allowedMap],
  );

  /**
   * Select a new sub tab and update controller and state.
   *
   */
  const selectSubTab = useCallback(
    (tab: Tab): void => {
      controller.selectSubTab(tab);
      setSubTab(tab);
    },
    [controller],
  );

  return { mainTab, subTab, availableSubTabs, selectMainTab, selectSubTab };
};
