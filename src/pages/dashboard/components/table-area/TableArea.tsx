import React from 'react';
import styles from '@/pages/dashboard/styles/TableArea.module.scss';
import { ScenarioTestDetailResponseResult } from '@/common/types/index.ts';
import TableRow from '@/pages/dashboard/components/table-area/TableRow.tsx';

interface TableAreaProps {
  results: ScenarioTestDetailResponseResult[];
  className: string;
}

const TableArea: React.FC<TableAreaProps> = ({ results, className }) => {
  return (
    <div className={className}>
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
