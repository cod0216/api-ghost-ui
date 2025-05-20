import React from 'react';
import styles from '@/pages/dashboard/styles/TableArea.module.scss';
import { ScenarioTestDetailResponseResult } from '@/pages/dashboard/types/index.ts';

interface DetailRowProps {
  isOpen: boolean;
  showAllTable: boolean;
  item: ScenarioTestDetailResponseResult;
}
1;

const safeParseJson = (data?: string): any => {
  if (!data) return data;
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};

const DetailRow: React.FC<DetailRowProps> = ({ isOpen, item, showAllTable }) => {
  console.log('[DetailRow] : ', showAllTable);
  return (
    <tr className={`${styles.detailRow} ${isOpen || showAllTable ? styles.expanded : ''}`}>
      <td colSpan={5} style={{ padding: 0, border: 'none' }}>
        <div
          className={`${styles.detailContentWrapper} ${isOpen || showAllTable ? styles.expanded : ''}`}
        >
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

            {Array.isArray(item?.route) &&
              item.route.length > 0 &&
              item.route.map((step, idx) => (
                <div key={idx} className={styles.detailColumn}>
                  <h3 className={styles.sectionTitle}>{`Step ${idx + 1}`}</h3>
                  <div key={idx} className={styles.stepCard}>
                    {step?.expected && (
                      <>
                        <h4>Expected</h4>
                        <div className={styles.stepRow}>
                          <span className={styles.label}>Status:</span>
                          <span className={styles.value}>{step.expected.status}</span>
                        </div>
                        <div className={styles.stepRow}>
                          <span className={styles.label}>Value:</span>
                          <pre className={styles.value}>
                            {step.expected.value
                              ? JSON.stringify(step.expected.value, null, 2)
                              : ''}
                          </pre>
                        </div>

                        <h4>Then</h4>
                        <div className={styles.stepRow}>
                          <span className={styles.label}>Next Step:</span>
                          <span className={styles.value}>{step.then?.step || ''}</span>
                        </div>
                        <div className={styles.stepRow}>
                          <span className={styles.label}>Store:</span>
                          <pre className={styles.value}>
                            {step.then?.store ? JSON.stringify(step.then.store, null, 2) : ''}
                          </pre>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default DetailRow;
