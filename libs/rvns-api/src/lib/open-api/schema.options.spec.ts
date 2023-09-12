import {
  GenericCreateResponseSchema,
  GenericResponseSchema,
} from './schema.options';

describe('GenericResponseSchema', () => {
  it('should return generic response schema', async () => {
    const res = GenericResponseSchema();
    expect(res.status).toBe(200);
    expect(res.schema).toHaveProperty('title');
    expect(res.schema).toHaveProperty('properties');
    expect(res.schema).toHaveProperty('required');
    expect(res.schema).toHaveProperty('type');
    expect(res.schema.title).toBe('GenericOkResponse');
    expect(res.schema.properties).toHaveProperty('statusCode');
    expect(res.schema.properties).toHaveProperty('message');
    expect(res.schema.properties).toHaveProperty('data');
    expect(res.schema.properties).toHaveProperty('error');
    expect(res.schema.properties.statusCode['type']).toBe('number');
    expect(res.schema.properties.statusCode['example']).toBe(200);
    expect(res.schema.properties.message['type']).toBe('string');
    expect(res.schema.properties.message['example']).toBe('OK');
    expect(res.schema.properties.data['type']).toBe('object');
    expect(res.schema.properties.error['type']).toBe('string');
    expect(res.schema.required).toStrictEqual(['statusCode', 'message']);
    expect(res.schema.type).toBe('object');
  });
  it('should return modified status code and message', async () => {
    const statusCode = 400;
    const statusMessage = 'Bad Request';

    const res = GenericResponseSchema({ statusCode, statusMessage });
    expect(res.status).toBe(statusCode);
    expect(res.schema.properties.statusCode['example']).toBe(statusCode);
    expect(res.schema.properties.message['example']).toBe(statusMessage);
  });
  it('should return modified schema title', async () => {
    const schemaTitle = 'DifferentSchemaTitle';
    const res = GenericResponseSchema({ schemaTitle });
    expect(res.schema.title).toBe(schemaTitle);
  });
  it('should return modified required properties', async () => {
    const schemaRequired = ['statusCode'];
    const res = GenericResponseSchema({ schemaRequired });
    expect(res.schema.required).toStrictEqual(['statusCode']);
  });
  it('should return modified schema data object', async () => {
    const options = {
      schemaData: {
        type: 'object',
        properties: {
          resourceId: { type: 'number' },
        },
      },
    };

    const res = GenericResponseSchema(options);
    expect(res.schema.properties.data).toBe(options.schemaData);
  });
});

describe('GenericCreateResponseSchema', () => {
  it('should return generic create response schema', async () => {
    const res = GenericCreateResponseSchema();
    expect(res.status).toBe(201);
    expect(res.schema.title).toBe('GenericCreateResponse');
    expect(res.schema.properties.message['example']).toBe('Created');
    expect(res.schema.properties.data).toHaveProperty('type');
    expect(res.schema.properties.data['type']).toBe('object');
    expect(res.schema.properties.data).toHaveProperty('required');
    expect(res.schema.properties.data['required']).toStrictEqual(['id']);
    expect(res.schema.properties.data).toHaveProperty('properties');
    expect(res.schema.properties.data['properties']).toHaveProperty('id');
    expect(res.schema.properties.data['properties']['id']).toHaveProperty(
      'type',
    );
    expect(res.schema.properties.data['properties']['id']['type']).toBe(
      'string',
    );
    expect(res.schema.properties.data['properties']['id']).toHaveProperty(
      'format',
    );
    expect(res.schema.properties.data['properties']['id']['format']).toBe(
      'uuid',
    );
  });
  it('should return modified id type', async () => {
    const res = GenericCreateResponseSchema({ idType: 'string' });
    expect(res.schema.properties.data['properties']['id']['type']).toBe(
      'string',
    );
  });
  it('should return modified id format', async () => {
    const res = GenericCreateResponseSchema({ idFormat: 'uuid' });
    expect(res.schema.properties.data['properties']['id']['format']).toBe(
      'uuid',
    );
  });
});
