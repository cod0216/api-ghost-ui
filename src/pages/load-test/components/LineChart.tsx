import React from 'react';
import { Line } from 'react-chartjs-2';

interface LineChartProps {
  data: any;
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  return (
    <div>
      <Line
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

export default LineChart;
