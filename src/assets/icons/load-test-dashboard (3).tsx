import { useState, useEffect } from "react";
import { 
  LineChart, 
  BarChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from "recharts";
import { Clock, Activity, Server, AlertTriangle, CheckCircle, BarChart2, PieChart as PieChartIcon, ArrowUp, ArrowDown } from "lucide-react";

// 타입 정의
type HttpReqs = {
  rate: number;
  count: number;
};

type HttpReqDuration = {
  avg: number;
  min: number;
  med: number;
  max: number;
  "p(90)": number;
  "p(95)": number;
};

type HttpReqFailed = {
  count: number;
  fail: number;
  rate: number;
};

type Iterations = {
  rate: number;
  count: number;
};

type Result = {
  iterations?: Iterations;
  http_reqs: HttpReqs;
  http_req_duration: HttpReqDuration;
  http_req_failed: HttpReqFailed;
  vus: number;
};

type Endpoint = {
  url: string;
  result: Result;
};

type TestData = {
  timeStamp: string;
  result: Result;
  endpoint: Endpoint[];
};

// 색상 팔레트
const COLORS = {
  primary: "#4361ee",
  secondary: "#3f37c9",
  success: "#4cc9f0",
  warning: "#f72585",
  danger: "#ef233c",
  background: "#f8f9fa",
  card: "#ffffff",
  text: "#212529",
  border: "#dee2e6",
  chart: ["#4361ee", "#3a0ca3", "#4cc9f0", "#f72585", "#7209b7", "#480ca8"]
};

// 샘플 데이터
const sampleData: TestData = {
  "timeStamp": "2025-04-23T14:15:00.000",
  "result": {
    "iterations": {
      "rate": 96.5,
      "count": 965
    },
    "http_reqs": {
      "rate": 96.9,
      "count": 969
    },
    "http_req_duration": {
      "avg": 8000,
      "min": 3200,
      "med": 7100,
      "max": 26400,
      "p(90)": 12500,
      "p(95)": 18300
    },
    "http_req_failed": {
      "count": 969,
      "fail": 0,
      "rate": 0
    },
    "vus": 100
  },
  "endpoint": [
    {
      "url": "/api/payment-methods",
      "result": {
        "http_reqs": {
          "rate": 96.9,
          "count": 969
        },
        "http_req_duration": {
          "avg": 8000,
          "min": 3200,
          "med": 7100,
          "max": 26400,
          "p(90)": 12500,
          "p(95)": 18300
        },
        "http_req_failed": {
          "count": 969,
          "fail": 0,
          "rate": 0
        },
        "vus": 100
      }
    },
    {
      "url": "/api/view-mypage",
      "result": {
        "http_reqs": {
          "rate": 78.5,
          "count": 785
        },
        "http_req_duration": {
          "avg": 6500,
          "min": 2800,
          "med": 5900,
          "max": 22100,
          "p(90)": 10800,
          "p(95)": 15600
        },
        "http_req_failed": {
          "count": 785,
          "fail": 2,
          "rate": 0.0025
        },
        "vus": 100
      }
    }
  ]
};

// 시계열 데이터 시뮬레이션을 위한 함수
function generateHistoricalData(baseValue, length = 20) {
  return Array.from({ length }, (_, i) => {
    const time = new Date();
    time.setMinutes(time.getMinutes() - (length - i));
    
    return {
      time: time.toISOString().substring(11, 19),
      value: baseValue * (0.8 + Math.random() * 0.4)
    };
  });
}

// 포맷팅 유틸리티
const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

const formatRate = (rate) => {
  return `${rate.toFixed(2)}/s`;
};

// KPI 카드 컴포넌트
const KpiCard = ({ title, value, icon, trend, trendValue, className }) => {
  const isPositive = trend === "up";
  const Icon = icon;
  
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon size={20} className="text-gray-400" />
      </div>
      <div className="flex items-baseline">
        <h2 className="text-2xl font-bold">{value}</h2>
        {trendValue && (
          <div className={`ml-2 flex items-center text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 차트 카드 컴포넌트 
const ChartCard = ({ title, children, icon, className }) => {
  const Icon = icon;
  
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon size={20} className="text-gray-400" />
      </div>
      {children}
    </div>
  );
};

// 메인 대시보드 컴포넌트
export default function LoadTestDashboard() {
  const [data, setData] = useState(sampleData);
  const [selectedEndpoint, setSelectedEndpoint] = useState("all");
  const [historicalRps, setHistoricalRps] = useState(generateHistoricalData(data.result.http_reqs.rate));
  const [historicalResponseTime, setHistoricalResponseTime] = useState(generateHistoricalData(data.result.http_req_duration.avg / 1000));
  
  // 실제 구현에서는 여기에 WebSocket 또는 폴링 로직 추가
  useEffect(() => {
    const interval = setInterval(() => {
      // 실시간 데이터를 가져오는 API 호출 대신 시뮬레이션
      setHistoricalRps(prev => [
        ...prev.slice(1),
        { 
          time: new Date().toISOString().substring(11, 19),
          value: data.result.http_reqs.rate * (0.9 + Math.random() * 0.2)
        }
      ]);
      
      setHistoricalResponseTime(prev => [
        ...prev.slice(1),
        { 
          time: new Date().toISOString().substring(11, 19),
          value: (data.result.http_req_duration.avg / 1000) * (0.9 + Math.random() * 0.2)
        }
      ]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // 현재 선택된 데이터에 따른 결과 가져오기
  const getCurrentResult = () => {
    if (selectedEndpoint === "all") {
      return data.result;
    }
    
    const endpoint = data.endpoint.find(e => e.url === selectedEndpoint);
    return endpoint ? endpoint.result : data.result;
  };
  
  const currentResult = getCurrentResult();
  
  // 응답 시간 분포 데이터
  const durationDistribution = [
    { name: "최소", value: currentResult.http_req_duration.min },
    { name: "평균", value: currentResult.http_req_duration.avg },
    { name: "중앙값", value: currentResult.http_req_duration.med },
    { name: "P90", value: currentResult.http_req_duration["p(90)"] },
    { name: "P95", value: currentResult.http_req_duration["p(95)"] },
    { name: "최대", value: currentResult.http_req_duration.max }
  ];
  
  // 엔드포인트별 성능 비교 데이터
  const endpointComparison = data.endpoint.map(endpoint => ({
    name: endpoint.url,
    responseTime: endpoint.result.http_req_duration.avg,
    rps: endpoint.result.http_reqs.rate
  }));
  
  // 성공 vs 실패 데이터
  const successVsFailure = [
    { name: "성공", value: currentResult.http_req_failed.count - currentResult.http_req_failed.fail },
    { name: "실패", value: currentResult.http_req_failed.fail }
  ];
  
  // 엔드포인트 선택 핸들러
  const handleEndpointChange = (e) => {
    setSelectedEndpoint(e.target.value);
  };
  
  const formattedTime = new Date(data.timeStamp).toLocaleString();
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">K6 부하 테스트 대시보드</h1>
            <p className="text-gray-500">마지막 업데이트: {formattedTime}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={selectedEndpoint} 
              onChange={handleEndpointChange}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">모든 엔드포인트</option>
              {data.endpoint.map((ep, idx) => (
                <option key={idx} value={ep.url}>{ep.url}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* KPI 카드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <KpiCard 
            title="초당 요청 수 (RPS)" 
            value={formatRate(currentResult.http_reqs.rate)}
            icon={Activity}
            trend="up"
            trendValue="3.2%"
          />
          <KpiCard 
            title="평균 응답 시간" 
            value={formatDuration(currentResult.http_req_duration.avg)}
            icon={Clock}
            trend="down"
            trendValue="1.8%"
          />
          <KpiCard 
            title="가상 사용자 수 (VUs)" 
            value={formatNumber(currentResult.vus)}
            icon={Server}
          />
          <KpiCard 
            title="오류율" 
            value={`${(currentResult.http_req_failed.rate * 100).toFixed(2)}%`}
            icon={AlertTriangle}
            trend={currentResult.http_req_failed.rate > 0.01 ? "up" : "down"}
            trendValue={currentResult.http_req_failed.rate > 0.01 ? "0.5%" : "0.0%"}
          />
        </div>
        
        {/* 차트 섹션 - 첫 번째 줄 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 실시간 RPS 차트 */}
          <ChartCard title="실시간 초당 요청 수 (RPS)" icon={Activity}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalRps}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(2)} req/s`, '요청 수']} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          
          {/* 실시간 응답 시간 차트 */}
          <ChartCard title="실시간 응답 시간" icon={Clock}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalResponseTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(2)}s`, '응답 시간']} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={COLORS.secondary}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
        
        {/* 차트 섹션 - 두 번째 줄 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 응답 시간 분포 차트 */}
          <ChartCard title="응답 시간 분포" icon={BarChart2} className="lg:col-span-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatDuration(value), '응답 시간']} />
                  <Bar dataKey="value" fill={COLORS.primary}>
                    {durationDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          
          {/* 성공 vs 실패 차트 */}
          <ChartCard title="요청 성공 vs 실패" icon={PieChartIcon}>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={successVsFailure}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  >
                    <Cell fill="#4ade80" />
                    <Cell fill="#f87171" />
                  </Pie>
                  <Tooltip formatter={(value) => [formatNumber(value), '요청 수']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
        
        {/* 엔드포인트 비교 섹션 */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <ChartCard title="엔드포인트별 성능 비교" icon={BarChart2}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={endpointComparison}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke={COLORS.primary} />
                  <YAxis yAxisId="right" orientation="right" stroke={COLORS.secondary} />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    name="응답 시간 (ms)" 
                    dataKey="responseTime" 
                    fill={COLORS.primary} 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="right" 
                    name="초당 요청 수 (RPS)" 
                    dataKey="rps" 
                    fill={COLORS.secondary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
        
        {/* 상세 지표 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">상세 지표</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지표</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">값</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentResult.iterations && (
                  <>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">반복 속도 (Iterations Rate)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatRate(currentResult.iterations.rate)}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">반복 횟수 (Iterations Count)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(currentResult.iterations.count)}</td>
                    </tr>
                  </>
                )}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">초당 요청 수 (RPS)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatRate(currentResult.http_reqs.rate)}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">총 요청 수</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(currentResult.http_reqs.count)}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">평균 응답 시간</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDuration(currentResult.http_req_duration.avg)}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">최소 응답 시간</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDuration(currentResult.http_req_duration.min)}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">중앙값 응답 시간</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDuration(currentResult.http_req_duration.med)}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">최대 응답 시간</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDuration(currentResult.http_req_duration.max)}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">P90 응답 시간</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDuration(currentResult.http_req_duration["p(90)"])}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">P95 응답 시간</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDuration(currentResult.http_req_duration["p(95)"])}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">실패율</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(currentResult.http_req_failed.rate * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">가상 사용자 수 (VUs)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{currentResult.vus}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}