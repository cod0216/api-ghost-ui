import React from 'react';
import styles from './CommonButton.module.scss';

interface CommonButtonProps {
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const CommonButton: React.FC<CommonButtonProps> = ({
  onConfirm,
  onCancel,
  confirmLabel = 'Save',
  cancelLabel = 'Cancel',
}) => {
  return (
    <footer className={styles.buttonRow}>
      <button className={styles.saveButton} onClick={onConfirm}>
        {confirmLabel}
      </button>
      <button className={styles.cancelButton} onClick={onCancel}>
        {cancelLabel}
      </button>
    </footer>
  );
};
