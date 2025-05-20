import React, { useState } from 'react';
import styles from '@/pages/dashboard/styles/TableArea.module.scss';
import { ScenarioTestDetailResponseResult } from '@/pages/dashboard/types/index.ts';
import TableRow from '@/pages/dashboard/components/table-area/TableRow.tsx';

interface TableAreaProps {
  results: ScenarioTestDetailResponseResult[];
  className: string;
}

/**
 * TableArea component displays a tabular view of raw request/response data.
 *
 * Each row shows basic metadata for a request: success status, method, endpoint, status code, and duration.
 * Data is rendered via the TableRow component.
 *
 * @param props - Table data and optional class name for styling.
 * @returns A styled table of scenario test results.
 *
 * @author haerim-kweon
 */
const TableArea: React.FC<TableAreaProps> = ({ results, className }) => {
  const [showAllTable, setShowAllTable] = useState<boolean>(false);
  const toggleAllShowTable = () => {
    setShowAllTable(!showAllTable);
  };

  return (
    <div className={className}>
      <div className={styles.titleRow}>
        <h4>Request / Response Raw Data</h4>
        <span className={styles.showAll} onClick={toggleAllShowTable}>
          showAll
        </span>
      </div>
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
              <TableRow key={idx} item={item} showAllTable={showAllTable} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableArea;
