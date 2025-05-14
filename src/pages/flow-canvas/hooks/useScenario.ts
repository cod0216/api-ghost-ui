import { useCallback } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { exportScenario as exportScenarioThunk } from '@/store/thunks/exportScenario';
import { selectScenario, setScenarioList } from '@/store/slices/scenarioSlice';
import type { ScenarioInfo } from '@/pages/flow-canvas/types';
import { getScenarioInfo, getScenarioList } from '../service/scenarioService';

export const useScenario = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(state => state.scenario.selected) as ScenarioInfo | null;

  const saveScenario = useCallback(async (): Promise<string | void> => {
    const defaultName = selected?.name ?? '';
    const nameInput = prompt('input save file name', defaultName);
    if (!nameInput) return;
    const name = nameInput.trim();

    const descInput = prompt('input scenario description ', selected?.description ?? '');
    const description = descInput != null ? descInput : (selected?.description ?? '');

    let timeoutMs: number;
    while (true) {
      const input = prompt('input test timeout', String(selected?.timeoutMs ?? 1000));
      if (input === null) {
        return;
      }
      const trimmed = input.trim();
      if (!/^\d+$/.test(trimmed)) {
        alert('Please enter numbers only.');
        continue;
      }
      timeoutMs = parseInt(trimmed, 10);
      break;
    }

    try {
      const actionResult = await dispatch(exportScenarioThunk({ name, description, timeoutMs }));
      const resp = unwrapResult(actionResult);
      if (!resp.status) {
        alert('Failed to save scenario.');
        return;
      }
      const list = await getScenarioList();
      dispatch(setScenarioList(list));
      const fullfillScenario = await getScenarioInfo(name + '.yaml');
      dispatch(selectScenario(fullfillScenario));
      return name;
    } catch (err) {
      alert('An error occurred while saving the scenario.');
    }
  }, [dispatch, selected]);

  const autoSave = useCallback(
    async (currentScenario: ScenarioInfo | null): Promise<void> => {
      if (!currentScenario) {
        return;
      }
      const { name, description, timeoutMs } = currentScenario;

      try {
        const actionResult = await dispatch(exportScenarioThunk({ name, description, timeoutMs }));
        const resp = unwrapResult(actionResult);

        if (!resp.status) {
          console.warn('Auto-save completed but status=false', resp);
          return;
        }
      } catch (error) {
        console.error('Auto-save failed with error:', error);
        alert(`Auto-save failed: ${error instanceof Error ? error.message : error}`);
      }
    },
    [dispatch],
  );

  const autoLoad = useCallback(
    async (fileName: string): Promise<void> => {
      try {
        const info = await getScenarioInfo(fileName);
        dispatch(selectScenario(info));
      } catch (error) {
        console.error('autoLoad fail', error);
      }
    },
    [dispatch],
  );

  return {
    saveScenario,
    autoSave,
    autoLoad,
  };
};
