import React, { useState } from 'react';
import styles from '@/pages/flow-canvas/styles/CustomNode.module.scss';

type EdgeLabelEditorProps = {
  edgeId: string;
  initialLabel?: string;
  onChangeLabel?: (newLabel: string) => void;
};

const EdgeLabelEditor: React.FC<EdgeLabelEditorProps> = ({
  edgeId,
  initialLabel = '200',
  onChangeLabel,
}) => {
  const [label, setLabel] = useState(initialLabel);
  const [editing, setEditing] = useState(false);

  const handleClick = () => {
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleBlur = () => {
    setEditing(false);
    if (onChangeLabel) {
      onChangeLabel(label);
    }
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
