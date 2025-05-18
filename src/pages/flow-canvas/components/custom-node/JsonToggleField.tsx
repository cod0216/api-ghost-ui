import React, { useState, useEffect } from 'react';
import styles from '@/pages/flow-canvas/styles/JsonToggleField.module.scss';
import { GenerateDataRequest } from '@/pages/flow-canvas/types';
import { getnergateData } from '@/pages/flow-canvas/service/dataGenertationService';

interface JsonToggleFieldProps {
  initialJson: string | object | null;
  defaultToJson?: boolean;
  editable?: boolean;
  className?: string;
  onChange?: (updated: string) => void;
}

interface FormRow {
  key: string;
  file: boolean;
  value: string;
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
  const [formRows, setFormRows] = useState<FormRow[]>([{ key: '', file: false, value: '' }]);
  const [prevText, setPrevText] = useState<string | null>(null);

  useEffect(() => {
    if (typeof initialJson === 'string') {
      setRawText(initialJson);
      try {
        setParsedJson(JSON.parse(initialJson));
      } catch {
        setParsedJson(null);
      }
    } else if (initialJson && typeof initialJson === 'object') {
      const str = JSON.stringify(initialJson, null, 2);
      setRawText(str);
      setParsedJson(initialJson);
    } else {
      setRawText('');
      setParsedJson(null);
    }
  }, [initialJson]);

  const toggleView = () => {
    setIsJsonView(v => !v);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const txt = e.target.value;
    setRawText(txt);
    try {
      setParsedJson(JSON.parse(txt));
    } catch {
      setParsedJson(null);
    }
  };
  const handleSave = () => onChange?.(rawText);

  const handleGenerate = async () => {
    setPrevText(rawText);
    try {
      const { jsonBody: gen } = await getnergateData({ jsonBody: rawText });
      setRawText(gen);
      try {
        setParsedJson(JSON.parse(gen));
      } catch {
        setParsedJson(null);
      }
      onChange?.(gen);
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

  const updateRow = (idx: number, field: keyof FormRow, value: string | boolean) => {
    setFormRows(rows => {
      const next = [...rows];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  useEffect(() => {
    const last = formRows[formRows.length - 1];
    if (last.key.trim() !== '' || last.file || last.value.trim() !== '') {
      setFormRows(rows => [...rows, { key: '', file: false, value: '' }]);
    }
  }, [formRows]);

  const deleteRow = (idx: number) => {
    setFormRows(rows => rows.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    const filtered = formRows
      .filter(r => r.key.trim() !== '')
      .map(r => ({ key: r.key, file: r.file, value: r.value }));
    onChange?.(JSON.stringify(filtered));
  }, [formRows, onChange]);

  return (
    <div className={`${styles.jsonContainer} ${className}`}>
      <div className={styles.toggleWrapper}>
        {isJsonView && (
          <>
            <button type="button" className={styles.aiButton} onClick={handleGenerate}>
              Ai
            </button>
            <button
              type="button"
              className={styles.aiButton}
              onClick={handleUndo}
              disabled={!prevText}
            >
              Undo
            </button>
          </>
        )}
        <button type="button" className={styles.toggleButton} onClick={toggleView}>
          {isJsonView ? 'JSON' : 'Form'}
        </button>
      </div>

      {editable ? (
        isJsonView ? (
          <textarea
            className={styles.textArea}
            value={parsedJson ? JSON.stringify(parsedJson, null, 2) : rawText}
            onChange={handleChange}
            onBlur={handleSave}
          />
        ) : (
          <table className={styles.formTable}>
            <thead>
              <tr>
                <th>Key</th>
                <th>File</th>
                <th>Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {formRows.map((row, idx) => {
                const isLast = idx === formRows.length - 1;
                return (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        value={row.key}
                        onChange={e => updateRow(idx, 'key', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={row.file}
                        onChange={e => updateRow(idx, 'file', e.target.checked)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.value}
                        onChange={e => updateRow(idx, 'value', e.target.value)}
                      />
                    </td>
                    <td>
                      {/* 마지막 빈 행은 삭제 불가, 최소 한 행은 유지 */}
                      {!isLast && formRows.length > 1 && (
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => deleteRow(idx)}
                        >
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      ) : (
        <pre className={styles.pre}>
          {isJsonView ? (parsedJson ? JSON.stringify(parsedJson, null, 2) : '') : rawText}
        </pre>
      )}
    </div>
  );
};

export default JsonToggleField;
