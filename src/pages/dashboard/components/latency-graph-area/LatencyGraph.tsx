import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import styles from '@/pages/dashboard/styles/LatencyGraph.module.scss';
import { HistoryItem } from '@/common/types/index.ts';

interface LatencyGraphProps {
  history: HistoryItem;
}

const LatencyGraph: React.FC<LatencyGraphProps> = ({ history }) => {
  const average = history.averageDurationMs;

  const latencyData = history.results.map((res, index) => ({
    name: `step ${index + 1}`,
    durationMs: res.durationMs,
  }));

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer>
        <AreaChart data={latencyData} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
          <defs>
            <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b486d" stopOpacity={0.8} />
              <stop offset="90%" stopColor="#3b486d" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={value => `${value}ms`} />

          <ReferenceLine
            y={average}
            stroke="#aaa"
            strokeDasharray="5 5"
            label={{ value: `Average ${average}ms`, position: 'insideTopRight', fill: '#888' }}
          />

          <Area
            type="monotone"
            dataKey="durationMs"
            stroke="#3b486d"
            fill="url(#colorLatency)"
            dot={{ stroke: '#3b486d', strokeWidth: 1 }}
            // activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LatencyGraph;
