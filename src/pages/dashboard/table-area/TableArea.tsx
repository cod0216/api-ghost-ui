/**
 * @fileoverview TableArea component displays a raw data table for request and response history.
 *
 * This component renders a table based on mock API history data.
 * It includes details such as HTTP method, endpoint, status code, duration,
 * timestamps, and headers/bodies of the requests and responses.
 *
 * Data is currently sourced from a mock object (`mockHistoryList`).
 *
 * @component
 * @returns {JSX.Element} A React functional component rendering request/response data in tabular form.
 */
import styles from './TableArea.module.scss';
import React from 'react';
import { ResultItem } from '@/types/index.ts';

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
              <th>Method</th>
              <th>Endpoint</th>
              <th>Status Code</th>
              <th>Duration (ms)</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Success</th>
              <th>Request Header</th>
              <th>Request Body</th>
              <th>Response Header</th>
              <th>Response Body</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx}>
                <td>{r.method}</td>
                <td>{r.endpoint}</td>
                <td>{r.statusCode}</td>
                <td>{r.durationMs}</td>
                <td>{r.startTime}</td>
                <td>{r.endTime}</td>
                <td>{r.isRequestSuccess ? '✅' : '❌'}</td>
                <td>
                  <pre>{JSON.stringify(r.requestHeader || r.requestHeaders, null, 2)}</pre>
                </td>
                <td>
                  <pre>{JSON.stringify(r.requestBody, null, 2)}</pre>
                </td>
                <td>
                  <pre>{JSON.stringify(r.responseHeaders, null, 2)}</pre>
                </td>
                <td>
                  <pre>{JSON.stringify(r.responseBody, null, 2)}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableArea;
