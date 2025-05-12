import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { exportScenario } from '@/store/thunks/exportScenario';

export const useScenario = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    const name = prompt('Enter scenario name', 'My Scenario');
    if (!name) return;
    const description = prompt('Enter a brief description', '');
    const timeoutMs = 10000;

    dispatch(
      exportScenario({
        name,
        description: description || '',
        timeoutMs,
      }),
    );
  }, [dispatch]);
};
