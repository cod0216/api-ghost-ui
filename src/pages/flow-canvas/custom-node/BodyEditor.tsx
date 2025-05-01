/**
 * @fileoverview BodyEditor.tsx
 *
 * BodyEditor is a popover UI component for editing the body of an API request.
 * It appears when the user toggles the body editor in a node and provides
 */

import React, { MouseEvent } from 'react';
import styles from '@/pages/flow-canvas/custom-node/BodyEditor.module.scss';

export interface BodyEditorProps {
  body: any;
  onSave: (newBody: any) => void;
  onClose: () => void;
}

/**
 * Provides a container for displaying a body editor UI.
 * Prevents the click event from bubbling up to parent elements.
 * Useful for stopping node collapse when interacting inside the editor.
 */
const BodyEditor: React.FC<BodyEditorProps> = ({ onClose }) => {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return <div className={styles.editorPopover} onClick={handleClick}></div>;
};

export default BodyEditor;
