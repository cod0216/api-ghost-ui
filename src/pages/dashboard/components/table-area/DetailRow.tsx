import React from 'react';
import styles from '@/pages/dashboard/styles/TableArea.module.scss';
import { ScenarioTestDetailResponseResult } from '@/common/types/index.ts';

interface DetailRowProps {
  isOpen: boolean;
  item: ScenarioTestDetailResponseResult;
}

const DetailRow: React.FC<DetailRowProps> = ({ isOpen, item }) => {
  return (
    <tr className={`${styles.detailRow} ${isOpen ? styles.expanded : ''}`}>
      <td colSpan={5} style={{ padding: 0, border: 'none' }}>
        <div className={`${styles.detailContentWrapper} ${isOpen ? styles.expanded : ''}`}>
          <div className={styles.detailContent}>
            <div className={styles.detailColumn}>
              <h3>Start Time</h3>
              <pre>{item.startTime}</pre>
            </div>

            <div className={styles.detailColumn}>
              <h3>End Time</h3>
              <pre>{item.endTime}</pre>
            </div>

            <div className={styles.detailColumn}>
              <h3>Request Headers</h3>
              <pre>{JSON.stringify(item.requestHeader || item.requestHeader, null, 2)}</pre>
            </div>

            <div className={styles.detailColumn}>
              <h3>Response Headers</h3>
              <pre>{JSON.stringify(item.responseHeaders, null, 2)}</pre>
            </div>

            <div className={styles.detailColumn}>
              <h3>Request Body</h3>
              <pre>{JSON.stringify(item.requestBody, null, 2)}</pre>
            </div>

            <div className={styles.detailColumn}>
              <h3>Response Body</h3>
              <pre>{JSON.stringify(item.responseBody, null, 2)}</pre>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default DetailRow;
