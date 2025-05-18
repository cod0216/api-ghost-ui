import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions, ChartDataset } from 'chart.js';

interface Point {
  x: number;
  y: number;
}

const generateTestData = (): { data: Point[]; data2: Point[] } => {
  const data: Point[] = [];
  const data2: Point[] = [];
  let prev = 100;
  let prev2 = 80;
  for (let i = 0; i < 1000; i++) {
    prev += 5 - Math.random() * 10;
    data.push({ x: i, y: prev });
    prev2 += 5 - Math.random() * 10;
    data2.push({ x: i, y: prev2 });
  }
  return { data, data2 };
};

const { data, data2 } = generateTestData();

const datasets: ChartDataset<'line'>[] = [
  {
    label: '지표 1',
    borderColor: 'red',
    borderWidth: 1,
    // radius: 0,
    data: data,
    parsing: false,
  },
  {
    label: '지표 2',
    borderColor: 'blue',
    borderWidth: 1,
    // radius: 0,
    data: data2,
    parsing: false,
  },
];

const chartData: ChartData<'line'> = {
  datasets,
};

const options: ChartOptions<'line'> = {
  responsive: true,
  interaction: {
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    x: {
      type: 'linear',
      title: {
        display: true,
        text: 'Time (X)',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Value (Y)',
      },
    },
  },
};

const MetricChart: React.FC = () => {
  return (
    <div>
      <h3>📈 예시 지표 그래프</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MetricChart;
