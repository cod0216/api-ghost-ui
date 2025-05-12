import { useState } from 'react';
import { KeyValue, MappingPair } from '@/pages/flow-canvas/types/mapping';

/**
 * Hook for managing 1:N field mappings between response (source) and request (targets).
 */
export const useMappingModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leftKeyValueList, setLeftKeyValueList] = useState<KeyValue[]>([]);
  const [rightKeyValueList, setRightKeyValueList] = useState<KeyValue[]>([]);
  const [leftEndpointTitle, setLeftEndpointTitle] = useState<string>('');
  const [rightEndpointTitle, setRightEndpointTitle] = useState<string>('');
  const [leftEndpointBaseUrl, setLeftEndpointBaseUrl] = useState<string>('');
  const [rightEndpointBaseUrl, setRightEndpointBaseUrl] = useState<string>('');
  const [leftSelectedKey, setLeftSelectedKey] = useState<string | null>(null);
  const [rightSelectedKey, setRightSelectedKey] = useState<string | null>(null);

  function openMappingModal(
    leftList: KeyValue[],
    rightList: KeyValue[],
    leftTitleText: string,
    rightTitleText: string,
    leftBaseUrlText: string,
    rightBaseUrlText: string,
    existing: MappingPair[] = [],
  ) {
    setLeftKeyValueList(leftList);
    setRightKeyValueList(rightList);
    setLeftEndpointTitle(leftTitleText);
    setRightEndpointTitle(rightTitleText);
    setLeftEndpointBaseUrl(leftBaseUrlText);
    setRightEndpointBaseUrl(rightBaseUrlText);
    if (existing.length > 0) {
      setLeftSelectedKey(existing[0].sourceKey);
      setRightSelectedKey(existing[0].targetKey);
    } else {
      setLeftSelectedKey(null);
      setRightSelectedKey(null);
    }
    setIsModalVisible(true);
  }

  function closeMappingModal() {
    setIsModalVisible(false);
  }

  return {
    isModalVisible,
    leftKeyValueList,
    rightKeyValueList,
    leftEndpointTitle,
    rightEndpointTitle,
    leftEndpointBaseUrl,
    rightEndpointBaseUrl,
    leftSelectedKey,
    rightSelectedKey,
    openMappingModal,
    saveMappingModal: closeMappingModal,
    cancelMappingModal: closeMappingModal,
  };
};
