import { useCallback } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { exportScenario as exportScenarioThunk } from '@/store/thunks/exportScenario';
import { selectScenario, setScenarioList, clearSelection } from '@/store/slices/scenarioSlice';
import type { ScenarioInfo } from '@/pages/flow-canvas/types';
import {
  getScenarioInfo,
  getScenarioList,
  scenarioDelete,
} from '@/pages/flow-canvas/service/scenarioService';
import { resetFlow } from '@/store/slices/flowSlice';
import { useToast } from '@/common/components/toast/ToastContext';

export const useScenario = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(state => state.scenario.selected) as ScenarioInfo | null;
  const existingFiles = useAppSelector(state => state.scenario.list);
  const { addToast } = useToast();

  const createScenario = useCallback(async (): Promise<string | void> => {
    if (selected) {
      autoSave(selected);
    }

    let name: string;
    while (true) {
      const input = prompt('Enter save file name', '');
      if (input === null || input.trim() === '') {
        addToast('File name is required.', 4000);
        return;
      }
      name = input.trim();
      break;
    }

    const fileName = `${name}.yaml`;

    if (existingFiles.includes(fileName)) {
      const overwrite = window.confirm(
        `A file named "${fileName}" already exists. Do you want to overwrite it?`,
      );
      if (!overwrite) {
        return;
      }
    }

    const descInput = prompt('input scenario description');
    const description = descInput ?? '';
    let timeoutMs: number;
    while (true) {
      const input = prompt('input test timeout', String(60000));
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
      dispatch(resetFlow());
      const actionResult = await dispatch(exportScenarioThunk({ name, description, timeoutMs }));
      const resp = unwrapResult(actionResult);
      if (!resp.status) {
        addToast('Failed to save scenario.', 4000);
        return;
      }
      const list = await getScenarioList();
      dispatch(setScenarioList(list));
      const fullfillScenario = await getScenarioInfo(fileName);
      dispatch(selectScenario(fullfillScenario));
      addToast('An error occurred during test execution.', 4000);
      return name;
    } catch (err) {
      alert('An error occurred while saving the scenario.');
    }
  }, [dispatch, selected, existingFiles]);

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

  const exportInline = useCallback(
    async (name: string, description: string, timeoutMs: number) => {
      const fileName = `${name}.yaml`;

      if (selected?.name !== name && existingFiles.includes(fileName)) {
        const overwrite = window.confirm(
          `A file named "${fileName}" already exists. Do you want to overwrite it?`,
        );
        if (!overwrite) {
          return;
        }
      }

      try {
        const actionResult = await dispatch(exportScenarioThunk({ name, description, timeoutMs }));

        const resp = unwrapResult(actionResult);
        if (!resp.status) {
          addToast('Failed to save scenario.', 4000);
          return;
        }

        const list = await getScenarioList();
        dispatch(setScenarioList(list));

        const info = await getScenarioInfo(`${name}.yaml`);

        dispatch(selectScenario(info));
      } catch (err) {
        console.error(err);
        addToast('An error occurred while saving the scenario.', 4000);
      }
    },
    [dispatch, existingFiles, selected],
  );

  const removeScenario = useCallback(async (): Promise<void> => {
    if (!selected) {
      addToast('No scenario selected to delete.', 4000);
      return;
    }

    const fileName = `${selected.name}.yaml`;
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      return;
    }

    try {
      const success = await scenarioDelete(fileName);
      if (!success) {
        addToast('Failed to delete scenario.', 4000);
        return;
      }

      try {
        const list = await getScenarioList();
        dispatch(setScenarioList(list));
      } catch (listErr) {
        console.warn('Scenario deleted, but list fetch failed:', listErr);
        addToast('Scenario deleted, but failed to refresh the scenario list.', 4000);
      }

      dispatch(clearSelection());
    } catch (err) {
      console.error('removeScenario error:', err);
      addToast('An error occurred while deleting the scenario.', 4000);
    }
  }, [selected, dispatch]);

  return {
    createScenario,
    autoSave,
    autoLoad,
    exportInline,
    removeScenario,
  };
};
