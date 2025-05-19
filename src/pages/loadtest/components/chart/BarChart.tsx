import React from 'react';
import { ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: any[];
  };
  title?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: !!title,
        text: title || '',
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ms`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (ms)',
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
