/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-explicit-any */
import { Schema, schema } from '@progress/kendo-angular-editor';

const imageSpec: any = {
  group: 'inline',
  inline: true,
  draggable: true,
  attrs: {
    src: {},
    alt: { default: null },
    title: { default: null },
    crossorigin: { default: 'anonymous' }, /// added
    uploadId: { default: null }, /// added
    error: { default: null }, /// added
    style: { default: null },
  },
  parseDOM: [
    {
      tag: 'img[src]',
      getAttrs(dom: any) {
        return {
          src: dom.getAttribute('src'),
          title: dom.getAttribute('title'),
          alt: dom.getAttribute('alt'),
          crossorigin: dom.getAttribute('crossorigin'), /// added
          uploadId: dom.getAttribute('uploadId'), /// added
          error: dom.getAttribute('error'), /// added
          style: dom.getAttribute('style'),
          height: { default: null },
          width: { default: null },
        };
      },
    },
  ],
  toDOM(node: any) {
    const {
      src,
      alt,
      title,
      uploadId,
      error,
      crossorigin,
      style,
      height,
      width,
    } = node.attrs; /// updated
    return [
      'img',
      { src, alt, title, uploadId, error, crossorigin, style, height, width },
    ]; /// updated
  },
};

export function getSchemaWithCrossorigin(): Schema {
  const { nodes, marks } = schema.spec;

  const updateNodes = schema.spec.nodes.update('image', imageSpec);

  const newSchema = new Schema({
    nodes: updateNodes,
    marks,
  });

  return newSchema;
}
