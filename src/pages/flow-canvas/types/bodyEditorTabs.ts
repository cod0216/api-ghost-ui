export type Tab = { label: string };
export type CombineTab = { mainTab: Tab; subTabs: Tab[] };

export const BODY_EDITOR_TABS: readonly CombineTab[] = [
  {
    mainTab: { label: 'Request' },
    subTabs: [{ label: 'Header' }, { label: 'Body' }, { label: 'Params' }],
  },
  {
    mainTab: { label: 'Response' },
    subTabs: [{ label: 'Header' }, { label: 'Body' }],
  },
] as const satisfies readonly CombineTab[];
