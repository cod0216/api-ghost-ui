import React from 'react';
import styles from './TableArea.module.scss';
import { ResultItem } from '@/types/index.ts';
import TableRow from './TableRow.tsx';

interface TableAreaProps {
  results: ResultItem[];
}

const TableArea: React.FC<TableAreaProps> = ({ results }) => {
  return (
    <div className={styles.tableArea}>
      <h4>Request / Response Raw Data</h4>
      <div className={styles.tableDataArea}>
        <table>
          <thead>
            <tr>
              <th>Success</th>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Status Code</th>
              <th>Duration (ms)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, idx) => (
              <TableRow key={idx} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableArea;
