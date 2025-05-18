import React, { useState, useEffect, ChangeEvent } from 'react';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';

interface RenderJsonSchemaProps {
  data: string;
  indent: number;
  onChange?: (updated: string) => void;
}

const RenderJsonSchema: React.FC<RenderJsonSchemaProps> = ({ data, indent = 0, onChange }) => {
  const [jsonText, setJsonText] = useState<string>(data);

  useEffect(() => {
    try {
      const obj = JSON.parse(data);
      setJsonText(JSON.stringify(obj, null, 2));
    } catch {
      setJsonText(data);
    }
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setJsonText(val);
    onChange?.(val);
  };

  return (
    <textarea
      className={styles.jsonSchema}
      style={{ marginLeft: indent * 10 }}
      value={jsonText}
      onChange={handleChange}
    />
  );
};

export default RenderJsonSchema;
