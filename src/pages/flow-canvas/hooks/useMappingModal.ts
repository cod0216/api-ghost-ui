import { useState } from 'react';
import { KeyValue } from '@/pages/flow-canvas/types/mapping.ts';

export const useMappingModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leftKeyValueList, setLeftKeyValueList] = useState<KeyValue[]>([]);
  const [rightKeyValueList, setRightKeyValueList] = useState<KeyValue[]>([]);
  const [leftEndpointTitle, setLeftEndpointTitle] = useState<string>('');
  const [rightEndpointTitle, setRightEndpointTitle] = useState<string>('');
  const [leftEndpointBaseUrl, setLeftEndpointBaseUrl] = useState<string>('');
  const [rightEndpointBaseUrl, setRightEndpointBaseUrl] = useState<string>('');

  function openMappingModal(
    leftList: KeyValue[],
    rightList: KeyValue[],
    leftTitleText: string,
    rightTitleText: string,
    leftBaseUrlText: string,
    rightBaseUrlText: string,
  ) {
    setLeftKeyValueList(leftList);
    setRightKeyValueList(rightList);
    setLeftEndpointTitle(leftTitleText);
    setRightEndpointTitle(rightTitleText);
    setLeftEndpointBaseUrl(leftBaseUrlText);
    setRightEndpointBaseUrl(rightBaseUrlText);
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
    openMappingModal,
    saveMappingModal: closeMappingModal,
    cancelMappingModal: closeMappingModal,
  };
};
