import React, { useState } from 'react';
import styles from './TableArea.module.scss';
import { ResultItem } from '@/types/index.ts';
import DetailRow from './DetailRow.tsx';

interface TableRowProps {
  item: ResultItem;
}

const TableRow: React.FC<TableRowProps> = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr onClick={() => setOpen(!open)} className={styles.summaryRow}>
        <td>{item.isRequestSuccess ? '✅' : '❌'}</td>
        <td>{item.method}</td>
        <td>{item.endpoint}</td>
        <td>{item.statusCode}</td>
        <td>{item.durationMs}</td>
      </tr>
      <DetailRow isOpen={open} item={item} />
    </>
  );
};

export default TableRow;
