import React from 'react';
import { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

interface LineChartProps {
  data: {
    labels: string[];
    datasets: any[];
  };
  title?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: !!title,
        text: title || '',
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    animation: {
      duration: 300,
    },
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
