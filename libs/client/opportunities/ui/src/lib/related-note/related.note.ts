export interface RelatedNote {
  id: string;

  name: string;

  template: string;

  createdBy: string;

  updatedAt: Date | string | null;

  fields: { id: string; value: string; name: string }[];
}
