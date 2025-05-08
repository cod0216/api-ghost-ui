import {
  ScenarioTestDetailResponse,
  ScenarioTestResultFileListItem,
} from '@/pages/dashboard/types/index.ts';
import { HttpMethod, ProtocolType } from '@/common/types/index.ts';

const mockScenarioTestDetailResponse: ScenarioTestDetailResponse = {
  name: 'User Signup Scenario',
  description: 'Test the process of user signup and login',
  executedAt: '2025-04-23T14:15:00+09:00',
  totalDurationMs: 550,
  averageDurationMs: 275,
  filePath: '/local/result/user-signup',
  isScenarioSuccess: true,
  results: [
    {
      stepName: 'signup',
      type: ProtocolType.HTTP,
      url: '/api/signup',
      method: HttpMethod.POST,
      requestBody: {
        file: {
          userImage: '/path/to/image.png',
          userTextFile: '/path/to/textfile.txt',
        },
        text: {
          userText: '{ "name": "John", "email": "john@example.com" }',
        },
        json: null,
      },
      requestHeader: {
        Authorization: 'Bearer abc.def.ghi',
        contentType: 'application/json',
      },
      responseBody: {
        status: 'success',
      },
      responseHeaders: {
        contentType: 'application/json',
      },
      status: 200,
      startTime: '2025-04-23T14:15:01.000+09:00',
      endTime: '2025-04-23T14:15:01.300+09:00',
      durationMs: 300,
      isRequestSuccess: true,
      route: [
        {
          expected: {
            status: '200',
            value: {
              fieldName: 'value',
            },
          },
          then: {
            store: {
              variableName: 'value',
            },
            step: 'store-variable',
          },
        },
      ],
    },
  ],
};

const mockScenarioTestResultFileList: ScenarioTestResultFileListItem[] = [
  {
    fileName: 'user-scenario-result-01',
    testSummary: true,
    timeStamp: '2025-04-23T07:57:59',
  },
  {
    fileName: 'user-scenario-result-02',
    testSummary: false,
    timeStamp: '2025-04-24T08:22:59',
  },
];

export { mockScenarioTestDetailResponse, mockScenarioTestResultFileList };
