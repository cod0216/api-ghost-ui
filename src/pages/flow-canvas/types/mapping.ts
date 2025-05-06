export interface KeyValue {
  key: string;
  value: string;
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
