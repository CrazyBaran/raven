export interface NoteFieldData {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly order: number;
  readonly value: string;
  readonly noteGroupId: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly createdById: string;
}
