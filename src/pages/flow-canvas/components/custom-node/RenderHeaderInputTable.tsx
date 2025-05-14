import React, { useEffect, useState } from 'react';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';

interface HeaderInputTableProps {
  header?: Record<string, string>;
  onChange: (updated: Record<string, string>) => void;
}

interface HeaderRow {
  key: string;
  value: string;
}

const RenderHeaderInputTable: React.FC<HeaderInputTableProps> = ({ header, onChange }) => {
  const [rows, setRows] = useState<HeaderRow[]>([]);

  useEffect(() => {
    const initialRows = header
      ? Object.entries(header).map(([key, value]) => ({ key, value }))
      : [];
    setRows([...initialRows, { key: '', value: '' }]);
  }, [JSON.stringify(header)]);

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

    onChange(updatedHeaders);
  };

  const handleDelete = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);

    const filtered = newRows.filter(row => row.key.trim() !== '');
    const updatedHeaders = Object.fromEntries(filtered.map(row => [row.key, row.value]));
    onChange(updatedHeaders);
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
