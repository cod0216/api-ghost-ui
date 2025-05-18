import React, { useEffect, useState, useRef } from 'react';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';

interface HeaderInputTableProps {
  header: string;
  onChange: (updated: string) => void;
}

interface HeaderRow {
  key: string;
  value: string;
}

const RenderHeaderInputTable: React.FC<HeaderInputTableProps> = ({ header, onChange }) => {
  const [rows, setRows] = useState<HeaderRow[]>([{ key: '', value: '' }]);
  const prevHeaderRef = useRef<string>('');

  useEffect(() => {
    if (prevHeaderRef.current !== header) {
      prevHeaderRef.current = header;

      let parsed: Record<string, string>;
      try {
        parsed = JSON.parse(header || '{}');
      } catch {
        parsed = {};
      }
      const initialRows = Object.entries(parsed).map(([key, value]) => ({ key, value }));
      setRows(
        initialRows.length > 0
          ? [...initialRows, { key: '', value: '' }]
          : [{ key: '', value: '' }],
      );
    }
  }, [header]);

  const handleChange = (index: number, field: 'key' | 'value', value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;

    if (
      index === rows.length - 1 &&
      newRows[index].key.trim() !== '' &&
      newRows[index].value.trim() !== ''
    ) {
      newRows.push({ key: '', value: '' });
    }

    setRows(newRows);
    const filtered = newRows.filter(row => row.key.trim() !== '');
    const updatedHeaders = Object.fromEntries(filtered.map(row => [row.key, row.value]));
    try {
      onChange(JSON.stringify(updatedHeaders));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);

    const filtered = newRows.filter(row => row.key.trim() !== '');
    const updatedHeaders = Object.fromEntries(filtered.map(row => [row.key, row.value]));
    try {
      onChange(JSON.stringify(updatedHeaders));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <table className={styles.headerTable}>
      <thead>
        <tr>
          <th>key</th>
          <th>value</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            <td>
              <input
                type="text"
                value={row.key}
                onChange={e => handleChange(idx, 'key', e.target.value)}
                placeholder="key"
              />
            </td>
            <td>
              <input
                type="text"
                value={row.value}
                onChange={e => handleChange(idx, 'value', e.target.value)}
                placeholder="value"
              />
            </td>
            <td className={styles.deleteSection}>
              {row.key || row.value ? (
                <button className={styles.deleteButton} onClick={() => handleDelete(idx)}>
                  x
                </button>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RenderHeaderInputTable;
