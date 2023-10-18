export interface NoteTabData {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly noteId: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly createdById: string;
}
