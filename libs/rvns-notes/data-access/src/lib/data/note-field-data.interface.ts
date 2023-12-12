export interface NoteFieldData {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly order: number;
  readonly value: string;
  readonly configuration?: Record<string, any>;
  readonly noteGroupId: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly createdById: string;
  readonly updatedById: string;
}
