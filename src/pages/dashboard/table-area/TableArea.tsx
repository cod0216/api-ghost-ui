import styles from './TableArea.module.scss';
import { mockHistoryList } from '../__mocks__/mockHistoryList.ts';
import React from 'react';

const TableArea: React.FC = () => {
  const results = mockHistoryList[0].results;

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
