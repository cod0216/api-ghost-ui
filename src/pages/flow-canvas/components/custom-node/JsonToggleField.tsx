import React, { useState, useEffect } from 'react';
import styles from '@/pages/flow-canvas/styles/JsonToggleField.module.scss';

interface JsonToggleFieldProps {
  initialJson: string | object | null;
  defaultToJson?: boolean;
  editable?: boolean;
  className?: string;
  onChange?: (updated: string) => void;
}

const JsonToggleField: React.FC<JsonToggleFieldProps> = ({
  initialJson = '',
  defaultToJson = true,
  editable = false,
  className = '',
  onChange,
}) => {
  const [isJsonView, setIsJsonView] = useState(defaultToJson);
  const [rawText, setRawText] = useState('');
  const [parsedJson, setParsedJson] = useState<object | null>(null);

  useEffect(() => {
    if (typeof initialJson === 'string') {
      setRawText(initialJson);
      try {
        const parsed = JSON.parse(initialJson);
        setParsedJson(parsed);
      } catch {
        setParsedJson(null);
      }
    } else if (typeof initialJson === 'object' && initialJson !== null) {
      const str = JSON.stringify(initialJson, null, 2);
      setRawText(str);
      setParsedJson(initialJson);
    } else {
      setParsedJson(null);
      setRawText('');
    }
  }, [initialJson]);

  const toggleView = () => {
    setIsJsonView(prev => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRawText(text);
    try {
      const parsed = JSON.parse(text);
      setParsedJson(parsed);
    } catch {
      setParsedJson(null);
    }
  };

  const handleSave = () => {
    if (onChange) onChange(rawText);
  };

  return (
    <div className={`${styles.jsonContainer} ${className}`}>
      <div className={styles.toggleWrapper}>
        <div className={styles.toggleButton} onClick={toggleView}>
          {isJsonView ? 'Text' : 'JSON'}
        </div>
      </div>

      {editable ? (
        <textarea
          className={styles.textArea}
          value={isJsonView && parsedJson ? JSON.stringify(parsedJson, null, 2) : rawText}
          onChange={handleChange}
          onBlur={handleSave}
        />
      ) : (
        <pre className={styles.pre}>
          {isJsonView ? (parsedJson ? JSON.stringify(parsedJson, null, 2) : '') : rawText}
        </pre>
      )}
    </div>
  );
};

export default JsonToggleField;
