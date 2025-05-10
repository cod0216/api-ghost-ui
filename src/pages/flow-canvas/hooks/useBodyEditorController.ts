/**
 * @fileoverview
 * Custom React hook that integrates the BodyEditorController with component state
 * to manage main and sub tab selection for the BodyEditor UI.
 */
import { useState, useCallback, useMemo } from 'react';
import { BodyEditorController } from '@/pages/flow-canvas/controllers/BodyEditorTabsController.ts';
import { CombineTab, Tab } from '@/pages/flow-canvas/types/index';

export const useBodyEditorController = (
  tabs: readonly CombineTab[],
  initialMainLabel?: string,
  initialSubLabel?: string,
) => {
  const [controller] = useState(() => {
    const ctrl = new BodyEditorController(tabs);
    if (initialMainLabel) {
      const main = tabs.find(g => g.mainTab.label === initialMainLabel)?.mainTab;
      if (main) ctrl.selectMainTab(main);
    }
    if (initialSubLabel) {
      const group = tabs.find(g => g.mainTab.label === ctrl.getMainTab().label);
      const sub = group?.subTabs.find(s => s.label === initialSubLabel);
      if (sub) ctrl.selectSubTab(sub);
    }
    return ctrl;
  });
  const [mainTab, setMainTab] = useState<Tab>(controller.getMainTab());
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

  return {
    mainTab,
    subTab,
    availableSubTabs,
    selectMainTab,
    selectSubTab,
  };
};
