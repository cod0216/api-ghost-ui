import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { exportScenario } from '@/store/thunks/exportScenario';

export const useScenario = () => {
  const dispatch = useAppDispatch();
  const saveScenario = useCallback(async (): Promise<string | null> => {
    const name = prompt('Enter scenario name', 'My Scenario');
    if (!name) return null;
    const description = prompt('Enter a brief description', '');
    const timeoutMs = 10000;

    await dispatch(
      exportScenario({
        name,
        description: description || '',
        timeoutMs,
      }),
    );
    return name;
  }, [dispatch]);

  return { saveScenario };
};
