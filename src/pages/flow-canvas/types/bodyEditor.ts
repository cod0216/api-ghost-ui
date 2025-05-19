import { constants } from 'buffer';

export type Tab = { label: string; showSchema?: boolean; showSave?: boolean };
export type CombineTab = { mainTab: Tab; subTabs: Tab[] };
export type Path = number[];

export const enum MainTabType {
  REQUEST = 'Request',
  RESPONSE = 'Response',
}

export const enum SubTabType {
  HEADER = 'Header',
  BODY = 'Body',
  // PARAMS = 'Params',
}

export const BODY_EDITOR_TABS: readonly CombineTab[] = [
  {
    mainTab: { label: MainTabType.REQUEST },
    subTabs: [
      { label: SubTabType.HEADER },
      { label: SubTabType.BODY, showSchema: true, showSave: true },
      // { label: SubTabType.PARAMS },
    ],
  },
  {
    mainTab: { label: MainTabType.RESPONSE },
    subTabs: [{ label: SubTabType.HEADER }, { label: SubTabType.BODY, showSchema: true }],
  },
] as const satisfies readonly CombineTab[];

export interface GenerateDataRequest {
  jsonBody: string;
}

export interface GenerateDataReponse {
  jsonBody: string;
}
