import {
  ApiResponseOptions,
  ApiResponseSchemaHost,
} from '@nestjs/swagger/dist/decorators/api-response.decorator';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const GenericResponseSchema = (options?: {
  statusCode?: number;
  statusMessage?: string;
  schemaTitle?: string;
  schemaRequired?: string[];
  schemaData?: SchemaObject | ReferenceObject;
}): ApiResponseSchemaHost => ({
  status: options?.statusCode || 200,
  schema: {
    title: options?.schemaTitle || 'GenericOkResponse',
    properties: {
      statusCode: { type: 'number', example: options?.statusCode || 200 },
      message: {
        type: 'string',
        example: options?.statusMessage || 'OK',
      },
      data: options?.schemaData || { type: 'object' },
      error: { type: 'string' },
    },
    required: options?.schemaRequired || ['statusCode', 'message'],
    type: 'object',
  },
});

export const GenericCreateResponseSchema = (options?: {
  idType?: string;
  idFormat?: string;
}): ApiResponseSchemaHost =>
  GenericResponseSchema({
    statusCode: 201,
    statusMessage: 'Created',
    schemaTitle: 'GenericCreateResponse',
    schemaRequired: ['statusCode', 'message', 'data'],
    schemaData: {
      type: 'object',
      properties: {
        id: {
          type: options?.idType || 'string',
          format: options?.idFormat || 'uuid',
        },
      },
      required: ['id'],
    },
  });

export const FileResponseSchema = (options: {
  mime: string;
}): ApiResponseOptions => ({
  status: 200,
  content: {
    [options.mime]: { schema: { type: 'string', format: 'binary' } },
  },
});
