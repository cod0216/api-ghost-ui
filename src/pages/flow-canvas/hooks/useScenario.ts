import { useCallback } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { exportScenario as exportScenarioThunk } from '@/store/thunks/exportScenario';
import {
  selectScenario,
  setScenarioList,
  clearSelection,
  resetScenarioContent,
} from '@/store/slices/scenarioSlice';
import type { ScenarioInfo } from '@/pages/flow-canvas/types';
import {
  getScenarioInfo,
  getScenarioList,
  scenarioDelete,
} from '@/pages/flow-canvas/service/scenarioService';
import { resetFlow } from '@/store/slices/flowSlice';

export const useScenario = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(state => state.scenario.selected) as ScenarioInfo | null;
  const existingFiles = useAppSelector(state => state.scenario.list);

  const createScenario = useCallback(async (): Promise<string | void> => {
    if (selected) {
      autoSave(selected);
    }

    let name: string;
    while (true) {
      const input = prompt('Enter save file name', '');
      if (input === null || input.trim() === '') {
        alert('File name is required.');
        continue;
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

    if (selected?.name !== name && existingFiles.includes(fileName)) {
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
      const input = prompt('input test timeout', String(1000));
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
        alert('Failed to save scenario.');
        return;
      }
      const list = await getScenarioList();
      dispatch(setScenarioList(list));
      const fullfillScenario = await getScenarioInfo(fileName);
      dispatch(selectScenario(fullfillScenario));
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
          alert('Failed to save scenario.');
          return;
        }
        const list = await getScenarioList();
        dispatch(setScenarioList(list));

        const info = await getScenarioInfo(`${name}.yaml`);
        dispatch(selectScenario(info));
      } catch (err) {
        console.error(err);
        alert('An error occurred while saving the scenario.');
      }
    },
    [dispatch, existingFiles, selected],
  );

  const removeScenario = useCallback(async (): Promise<void> => {
    if (!selected) {
      alert('No scenario selected to delete.');
      return;
    }

    const fileName = `${selected.name}.yaml`;
    console.log(fileName);
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      return;
    }

    try {
      const success = await scenarioDelete(fileName).then().catch();
      if (!success) {
        alert('Failed to delete scenario.');
        return;
      }

      const list = await getScenarioList();
      dispatch(setScenarioList(list));

      dispatch(clearSelection());
    } catch (err) {
      console.error('removeScenario error:', err);
      alert('An error occurred while deleting the scenario.');
    }
  }, [dispatch, selected]);

  return {
    createScenario,
    autoSave,
    autoLoad,
    exportInline,
    removeScenario,
  };
};
