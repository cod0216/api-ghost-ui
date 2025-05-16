// __mock__/index.ts

export const requestRateData = {
  labels: ['0s', '10s', '20s', '30s', '40s'],
  datasets: [
    {
      label: 'Requests/sec',
      data: [50, 80, 60, 70, 90],
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      tension: 0.3,
    },
  ],
};

export const responseTimeTrendData = {
  labels: ['0s', '10s', '20s', '30s', '40s'],
  datasets: [
    {
      label: 'Response Time (ms)',
      data: [3000, 5000, 4000, 4500, 6000],
      borderColor: 'rgba(153,102,255,1)',
      backgroundColor: 'rgba(153,102,255,0.2)',
      tension: 0.3,
    },
  ],
};

export const responseTimeDistData = {
  labels: ['0-2s', '2-4s', '4-6s', '6-8s', '8s+'],
  datasets: [
    {
      label: 'Responses',
      data: [20, 40, 25, 10, 5],
      backgroundColor: 'rgba(255,159,64,0.6)',
      borderColor: 'rgba(255,159,64,1)',
      borderWidth: 1,
    },
  ],
};
export const failureRateTrendData = {
  labels: ['00:00', '00:10', '00:20', '00:30', '00:40', '00:50'],
  datasets: [
    {
      label: 'Failure Rate (%)',
      data: [0, 0.5, 1.2, 0.8, 0.3, 0],
      borderColor: 'rgba(255, 206, 86, 1)',
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      fill: true,
      tension: 0.4,
    },
  ],
};

export const failureRateSummaryData = {
  labels: ['Success', 'Failure'],
  datasets: [
    {
      label: 'Failures',
      data: [95, 5],
      backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)'],
      borderColor: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)'],
      borderWidth: 1,
    },
  ],
};

export const vusData = {
  labels: ['0s', '10s', '20s', '30s', '40s'],
  datasets: [
    {
      label: 'VUs',
      data: [1, 10, 20, 25, 20],
      borderColor: 'rgba(54,162,235,1)',
      backgroundColor: 'rgba(54,162,235,0.2)',
      tension: 0.3,
    },
  ],
};
