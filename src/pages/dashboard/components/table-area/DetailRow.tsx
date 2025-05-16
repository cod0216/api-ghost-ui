import React from 'react';
import styles from '@/pages/dashboard/styles/TableArea.module.scss';
import { ScenarioTestDetailResponseResult } from '@/pages/dashboard/types/index.ts';

interface DetailRowProps {
  isOpen: boolean;
  item: ScenarioTestDetailResponseResult;
}

const safeParseJson = (data?: string): any => {
  if (!data) return data;
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};

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
              <pre>{item.requestHeader && JSON.stringify(item.requestHeader ?? {}, null, 2)}</pre>
            </div>

            <div className={styles.detailColumn}>
              <h3>Response Headers</h3>
              <pre>
                {item.responseHeaders && JSON.stringify(item.responseHeaders ?? {}, null, 2)}
              </pre>
            </div>

            <div className={styles.detailColumn}>
              <h3>Request Body</h3>
              <pre>
                {item.requestBody?.json &&
                  JSON.stringify(safeParseJson(item.requestBody?.json!), null, 2)}
              </pre>
            </div>

            <div className={styles.detailColumn}>
              <h3>Response Body</h3>
              <pre>
                {item.responseBody && JSON.stringify(safeParseJson(item.responseBody), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default DetailRow;
