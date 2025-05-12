import React, { useState } from 'react';
import { Field } from '@/pages/flow-canvas/types/index.ts';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';

interface RenderJsonSchemaProps {
  data: Field[] | Field | undefined;
  indent: number;
  onChange?: (updated: Field[]) => void;
}

const RenderJsonSchema: React.FC<RenderJsonSchemaProps> = ({ data, indent, onChange }) => {
  const [localData, setLocalData] = useState<Field[]>(
    Array.isArray(data) ? data : data ? [data] : [],
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleValueChange = (index: number, value: string) => {
    const updated = localData.map((field, i) => (i === index ? { ...field, value } : field));
    setLocalData(updated);
    onChange?.(updated);
  };

  return (
    <>
      <div style={{ marginLeft: indent * 10 }}>{'{'}</div>
      {localData.map((field, index) => (
        <div key={`${field.name}-${index}`} style={{ marginLeft: indent * 10 + 10 }}>
          <div>
            <span>"{field.name}"</span>
            {' : '}
            {'"'}
            {editingIndex === index ? (
              <input
                type="text"
                autoFocus
                value={field.value ? String(field.value) : ''}
                onChange={e => handleValueChange(index, e.target.value)}
                onBlur={() => setEditingIndex(null)}
                className={styles.editInput}
              />
            ) : (
              <span onClick={() => setEditingIndex(index)} className={styles.editableValue}>
                {field.value ?? ''}
              </span>
            )}
            {'"'}
          </div>

          {field.nestedFields && field.nestedFields.length > 0 && (
            <RenderJsonSchema
              data={field.nestedFields}
              indent={indent + 1}
              onChange={updatedNested => {
                const updated = [...localData];
                updated[index].nestedFields = updatedNested;
                setLocalData(updated);
                onChange?.(updated);
              }}
            />
          )}
        </div>
      ))}
      <div style={{ marginLeft: indent * 10 }}>{'}'}</div>
    </>
  );
};

export default RenderJsonSchema;
