import React, { useState } from 'react';
import styles from '@/pages/dashboard/styles/TableArea.module.scss';
import { ScenarioTestDetailResponseResult } from '@/common/types/index.ts';
import DetailRow from '@/pages/dashboard/components/table-area/DetailRow.tsx';
import LightIndicator from '@/common/components/LightIndicator.tsx';

interface TableRowProps {
  item: ScenarioTestDetailResponseResult;
}

const TableRow: React.FC<TableRowProps> = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr onClick={() => setOpen(!open)} className={styles.summaryRow}>
        <td>
          <LightIndicator isSuccess={item.isRequestSuccess} />
        </td>
        <td>{item.method}</td>
        <td>{item.url}</td>
        <td>{item.statusCode}</td>
        <td>{item.durationMs}</td>
      </tr>
      <DetailRow isOpen={open} item={item} />
    </>
  );
};

export default TableRow;
