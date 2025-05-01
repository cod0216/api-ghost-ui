// BodyEditor.tsx
import React, { MouseEvent } from 'react';
import styles from '@/pages/flow-canvas/custom-node/BodyEditor.module.scss';

export interface BodyEditorProps {
  body: any;
  onSave: (newBody: any) => void;
  onClose: () => void;
}

const BodyEditor: React.FC<BodyEditorProps> = ({ onClose }) => {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return <div className={styles.editorPopover} onClick={handleClick}></div>;
};

export default BodyEditor;
