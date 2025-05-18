// mockSnapshots.ts
import { Snapshot } from './types';

export const mockSnapshots: Snapshot[] = [
  {
    timeStamp: '2025-04-23T14:15:00.000',
    result: {
      iterations: { rate: 92.3, count: 923 },
      http_reqs: { rate: 94.7, count: 947 },
      http_req_duration: {
        avg: 8200,
        min: 3100,
        med: 7500,
        max: 26700,
        'p(90)': 12800,
        'p(95)': 18500,
      },
      http_req_failed: { count: 947, fail: 0, rate: 0 },
      vus: 90,
    },
    endpoint: [
      {
        url: '/api/payment-methods',
        result: {
          http_reqs: { rate: 47.5, count: 475 },
          http_req_duration: {
            avg: 7800,
            min: 3000,
            med: 7200,
            max: 26000,
            'p(90)': 12000,
            'p(95)': 18000,
          },
          http_req_failed: { count: 475, fail: 0, rate: 0 },
          vus: 90,
        },
      },
      {
        url: '/api/view-mypage',
        result: {
          http_reqs: { rate: 47.2, count: 472 },
          http_req_duration: {
            avg: 8500,
            min: 3300,
            med: 7800,
            max: 27300,
            'p(90)': 13500,
            'p(95)': 19000,
          },
          http_req_failed: { count: 472, fail: 0, rate: 0 },
          vus: 90,
        },
      },
    ],
  },
  {
    timeStamp: '2025-04-23T14:15:10.000',
    result: {
      iterations: { rate: 95.5, count: 1910 },
      http_reqs: { rate: 97.0, count: 1940 },
      http_req_duration: {
        avg: 7900,
        min: 3000,
        med: 7300,
        max: 26000,
        'p(90)': 12500,
        'p(95)': 18300,
      },
      http_req_failed: { count: 1940, fail: 2, rate: 0.001 },
      vus: 100,
    },
    endpoint: [
      {
        url: '/api/payment-methods',
        result: {
          http_reqs: { rate: 48.6, count: 972 },
          http_req_duration: {
            avg: 7600,
            min: 2800,
            med: 7100,
            max: 25000,
            'p(90)': 12000,
            'p(95)': 17900,
          },
          http_req_failed: { count: 972, fail: 1, rate: 0.001 },
          vus: 100,
        },
      },
      {
        url: '/api/view-mypage',
        result: {
          http_reqs: { rate: 48.4, count: 968 },
          http_req_duration: {
            avg: 8200,
            min: 3200,
            med: 7500,
            max: 27000,
            'p(90)': 13000,
            'p(95)': 18600,
          },
          http_req_failed: { count: 968, fail: 1, rate: 0.001 },
          vus: 100,
        },
      },
    ],
  },
  {
    timeStamp: '2025-04-23T14:15:20.000',
    result: {
      iterations: { rate: 98.2, count: 2937 },
      http_reqs: { rate: 99.8, count: 2994 },
      http_req_duration: {
        avg: 7600,
        min: 2800,
        med: 7000,
        max: 25000,
        'p(90)': 12000,
        'p(95)': 18000,
      },
      http_req_failed: { count: 2994, fail: 1, rate: 0.0003 },
      vus: 110,
    },
    endpoint: [
      {
        url: '/api/payment-methods',
        result: {
          http_reqs: { rate: 50.0, count: 1500 },
          http_req_duration: {
            avg: 7300,
            min: 2600,
            med: 6900,
            max: 24000,
            'p(90)': 11800,
            'p(95)': 17700,
          },
          http_req_failed: { count: 1500, fail: 0, rate: 0 },
          vus: 110,
        },
      },
      {
        url: '/api/view-mypage',
        result: {
          http_reqs: { rate: 49.8, count: 1494 },
          http_req_duration: {
            avg: 7900,
            min: 3000,
            med: 7100,
            max: 26000,
            'p(90)': 12200,
            'p(95)': 18100,
          },
          http_req_failed: { count: 1494, fail: 1, rate: 0.0007 },
          vus: 110,
        },
      },
    ],
  },
];
