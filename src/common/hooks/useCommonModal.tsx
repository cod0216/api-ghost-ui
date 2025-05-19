import { useState, useCallback } from 'react';
import CommonModal from '@/common/components/CommonModal';
import { ReactNode } from 'react';

interface UseCommonModalProps {
  title: string;
  child: ReactNode;
  onClose?: () => void;
  onCancle?: () => void;
  showButton?: boolean;
}

export const useCommonModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState<UseCommonModalProps | null>(null);

  const openModal = useCallback((props: UseCommonModalProps) => {
    setModalProps(props);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalProps(null);
  }, []);

  const ModalComponent = () => {
    if (!isOpen || !modalProps) return null;

    return (
      <CommonModal
        title={modalProps.title}
        child={modalProps.child}
        onConfirm={() => {
          closeModal();
          modalProps.onClose?.();
        }}
        onCancle={() => {
          closeModal();
          modalProps.onCancle?.();
        }}
        showButton={modalProps.showButton}
      />
    );
  };

  return {
    openModal,
    closeModal,
    ModalComponent,
  };
};
