import React from 'react';
import { ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
interface DoughnutChartProps {
  data: {
    labels: string[];
    datasets: any[];
  };
  title?: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, title }) => {
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: !!title,
        text: title || '',
      },
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: context => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
            const percentage = Math.round((value * 100) / total);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
