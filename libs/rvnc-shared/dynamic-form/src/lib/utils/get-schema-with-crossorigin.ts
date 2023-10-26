import { Schema, schema } from '@progress/kendo-angular-editor';

export function getSchemaWithCrossorigin(): Schema {
  const image = { ...schema.spec.nodes.get('image') };
  image!.attrs!['crossorigin'] = { default: 'anonymous' };
  const nodes = schema.spec.nodes.update('image', image);
  const mySchema = new Schema({
    marks: schema.spec.marks,
    nodes,
  });
  return mySchema;
}
