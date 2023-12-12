export interface HeatmapThresholdData {
  readonly thresholds: number[];
}

export interface HeatmapFieldConfigurationData extends HeatmapThresholdData {
  readonly unit: string;
  readonly min: number;
  readonly max: number;
}

export interface FieldDefinitionData {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly order: number;
  readonly fieldGroupId: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly configuration?: HeatmapFieldConfigurationData | null;
}
