import { INestApplication, Injectable } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

@Injectable()
export class SwaggerService {
  public enableSwagger(
    app: INestApplication,
    apiRoot: string,
    version: string
  ): void {
    const jsonPath = apiRoot ? `/${apiRoot}-json` : '/-json';
    const config = new DocumentBuilder()
      .setTitle('Raven')
      .setDescription(
        `Raven API - <a href="${jsonPath}" target="_blank">openapi.json</a>`
      )
      .setVersion(version)
      .addBearerAuth()
      .build();
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: (a, b) => {
          const methodPriority = {
            get: '1',
            post: '2',
            patch: '3',
            put: '4',
            delete: '5',
          };
          return methodPriority[a.get('method')].localeCompare(
            methodPriority[b.get('method')]
          );
        },
      },
      customSiteTitle: 'Raven API Docs',
    };
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(apiRoot, app, document, customOptions);
  }
}
