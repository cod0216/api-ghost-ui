import React, { useState, useEffect } from 'react';
import styles from '@/pages/flow-canvas/styles/CustomNode.module.scss';
import { useFlowCanvas } from '@/pages/flow-canvas/hooks/useFlowCanvas';

interface EdgeLabelEditorProps {
  edgeId: string;
  initialLabel?: string;
  onChangeLabel?: (newLabel: string) => void;
}

const EdgeLabelEditor: React.FC<EdgeLabelEditorProps> = ({ edgeId, initialLabel = '200' }) => {
  const [label, setLabel] = useState(initialLabel);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setLabel(initialLabel);
  }, [initialLabel]);

  const handleClick = () => {
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const { onChangeLabel } = useFlowCanvas();

  const handleBlur = () => {
    setEditing(false);
    onChangeLabel(edgeId, label);
  };

  return (
    <div className={styles.labelWrapper} onClick={handleClick}>
      {editing ? (
        <input
          className={styles.labelInput}
          autoFocus
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <span className={styles.label}>{label}</span>
      )}
    </div>
  );
};

export default EdgeLabelEditor;
