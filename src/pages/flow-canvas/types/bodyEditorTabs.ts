export type Tab = { label: string; showSchema?: boolean; showSave?: boolean };
export type CombineTab = { mainTab: Tab; subTabs: Tab[] };

export const BODY_EDITOR_TABS: readonly CombineTab[] = [
  {
    mainTab: { label: 'Request' },
    subTabs: [
      { label: 'Header' },
      { label: 'Body', showSchema: true, showSave: true },
      { label: 'Params' },
    ],
  },
  {
    mainTab: { label: 'Response' },
    subTabs: [{ label: 'Header' }, { label: 'Body', showSchema: true }],
  },
] as const satisfies readonly CombineTab[];
