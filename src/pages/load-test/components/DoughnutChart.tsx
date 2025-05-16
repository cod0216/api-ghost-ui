import React from 'react';
import { Doughnut } from 'react-chartjs-2';

interface DoughnutChartProps {
  data: any;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  return (
    <div className="chart-container">
      <Doughnut
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'Response Time Distribution' },
          },
        }}
      />
    </div>
  );
};

export default DoughnutChart;
