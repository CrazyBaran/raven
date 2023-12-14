export interface CalculationConfigData {
  readonly type: 'division' | 'efficiency';
  readonly values: number[];
}

export interface HeatmapFieldConfigurationData {
  readonly unit: string;
  readonly min: number;
  readonly max: number;
  readonly thresholds: number[];
  readonly calculationConfig?: CalculationConfigData;
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
