export interface FieldGroupData {
  readonly id: string;
  readonly name: string;
  readonly tabId?: string;
  readonly tabName?: string;
  readonly order: number;
  readonly templateId: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
}
