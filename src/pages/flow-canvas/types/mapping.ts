export interface KeyValue {
  key: string;
  value: string;
  type: string;
}

export interface MappingPair {
  sourceKey: string;
  targetKey: string;
}

export interface FieldSchema {
  name: string;
  type: string;
  nestedFields?: FieldSchema[];
}

export interface MappingPanelConfig {
  endpointTitle: string;
  baseUrl: string;
  dataList: KeyValue[];
  selectedKeys: string[];
  onToggleKey: (key: string) => void;
  label: string;
}
