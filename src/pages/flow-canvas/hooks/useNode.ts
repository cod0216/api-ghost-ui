import { selectNode, setActiveTab } from '@/store/slices/nodeSlice';
import { MainTabType } from '../types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export const useNode = () => {
  const dispatch = useAppDispatch();
  const { selectedNodeId, activeTab } = useAppSelector(state => state.node);

  return {
    selectedNodeId,
    activeTab,
    selectNode: (id: string) => dispatch(selectNode(id)),
    setActiveTab: (tab: MainTabType) => dispatch(setActiveTab(tab)),
  };
};
