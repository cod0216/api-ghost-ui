import React from 'react';
import styles from './TableArea.module.scss';
import { ResultItem } from '@/types/index.ts';

interface DetailRowProps {
  isOpen: boolean;
  item: ResultItem;
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
              <pre>{JSON.stringify(item.requestHeader || item.requestHeaders, null, 2)}</pre>
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
