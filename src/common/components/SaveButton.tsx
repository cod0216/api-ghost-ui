import React from 'react';
import styles from './SaveButton.module.scss';
import saveIcon from '@/assets/icons/save.svg';

interface SaveButtonProps {
  onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave }) => {
  return (
    <button className={styles.container} onClick={onSave}>
      <img src={saveIcon} alt="Save Scenario" width={24} height={24} />
    </button>
  );
};

export default SaveButton;
