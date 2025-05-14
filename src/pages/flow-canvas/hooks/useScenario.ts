// pages/flow-canvas/hooks/useScenario.ts
import { useCallback } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { exportScenario as exportScenarioThunk } from '@/store/thunks/exportScenario';
import { selectScenario, addToList } from '@/store/slices/scenarioSlice';
import type { ScenarioInfo } from '@/pages/flow-canvas/types';

/**
 * useScenario 훅
 * - 현재 선택된 시나리오의 이름을 기본값으로 prompt
 * - Redux thunk를 통해 서버에 저장 요청
 * - 저장 성공 시 Redux 상태(목록·선택)를 동기화
 */
export const useScenario = () => {
  const dispatch = useAppDispatch();
  const saveScenario = useCallback(async (): Promise<string | null> => {
    const name = prompt('Enter scenario name', 'My Scenario');
    if (!name) return null;
    const description = prompt('Enter a brief description', '');
    const timeoutMs = 10000;

  return useCallback(async (): Promise<string | void> => {
    // 1) 기본 파일명
    const defaultName = selected?.name ?? '';
    console.log('[useScenario] defaultName:', defaultName);
    const name = prompt('저장할 시나리오 파일 이름을 입력하세요', defaultName);
    console.log('[useScenario] prompt result name:', name);
    if (!name) {
      console.log('[useScenario] name prompt cancelled or empty');
      return;
    }

    // 2) 메타 정보
    const description = selected?.description ?? '';
    const timeoutMs = selected?.timeoutMs ?? 0;
    console.log('[useScenario] metadata:', { name, description, timeoutMs });

    try {
      console.log('[useScenario] dispatching exportScenarioThunk');
      const actionResult = await dispatch(exportScenarioThunk({ name, description, timeoutMs }));
      console.log('[useScenario] dispatch result action:', actionResult);
      const resp = unwrapResult(actionResult);
      console.log('[useScenario] unwrapResult resp:', resp);
      if (!resp.status) {
        console.warn('[useScenario] save failed, resp.status false');
        alert('시나리오 저장에 실패했습니다.');
        return;
      }

      // 4) 목록에 새 이름 추가 (변경된 경우)
      if (defaultName !== name) {
        console.log('[useScenario] adding new name to list:', name);
        dispatch(addToList(name));
      }

      // 5) 선택된 시나리오 업데이트
      const updatedScenario: ScenarioInfo = {
        ...(selected as ScenarioInfo),
        name,
        description,
        timeoutMs,
      }),
    );
    return name;
  }, [dispatch]);

  return { saveScenario };
};
