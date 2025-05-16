import React from 'react';
import { Bar } from 'react-chartjs-2';

interface BarChartProps<T> {
  data: any;
}

const BarChart = <T,>({ data }: BarChartProps<T>) => {
  return (
    <div className="chart-container">
      <Bar
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

export default BarChart;
