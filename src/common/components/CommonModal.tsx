import React, { ReactNode } from 'react';
import styles from '@/common/components/CommonModal.module.scss';
import { CommonButton } from '@/common/components/CommonButton';

interface CommonModalProps {
  onConfirm: () => void;
  onCancle: () => void;
  title: string;
  child: ReactNode;
  showButton?: boolean;
}

const CommonModal: React.FC<CommonModalProps> = ({
  onConfirm,
  onCancle,
  title,
  child,
  showButton = true,
}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.content}>{child}</div>
        {showButton && <CommonButton onConfirm={onConfirm} onCancel={onCancle} />}
      </div>
    </div>
  );
};

export default CommonModal;
