import React, { useState, useEffect } from 'react';
import styles from '@/pages/flow-canvas/styles/JsonToggleField.module.scss';
import { GenerateDataRequest } from '@/pages/flow-canvas//types';
import { getnergateData } from '@/pages/flow-canvas/service/dataGenertationService';

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
  const [prevText, setPrevText] = useState<string | null>(null);

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

  const handleGenerate = async () => {
    setPrevText(rawText);
    try {
      const payload: GenerateDataRequest = { jsonBody: rawText };

      const { jsonBody: generated } = await getnergateData(payload);
      setRawText(generated);
      try {
        setParsedJson(JSON.parse(generated));
      } catch {
        setParsedJson(null);
      }
      onChange?.(generated);
    } catch (err) {
      console.error('AI generate fail:', err);
    }
  };

  const handleUndo = () => {
    if (prevText !== null) {
      setRawText(prevText);
      try {
        setParsedJson(JSON.parse(prevText));
      } catch {
        setParsedJson(null);
      }
      onChange?.(prevText);
      setPrevText(null);
    }
  };

  return (
    <div className={`${styles.jsonContainer} ${className}`}>
      <div className={styles.toggleWrapper}>
        <div className={styles.toggleButton} onClick={handleGenerate}>
          {'Ai'}
        </div>
        <div className={styles.toggleButton} onClick={handleUndo}>
          Undo
        </div>
        <div className={styles.toggleButton} onClick={toggleView}>
          {isJsonView ? 'Text' : 'JSON'}
        </div>
      </div>

      {editable ? (
        <textarea
          className={styles.textArea}
          value={isJsonView && parsedJson ? JSON.stringify(parsedJson, null, 4) : rawText}
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
