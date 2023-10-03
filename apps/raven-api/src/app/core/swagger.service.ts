import { INestApplication, Injectable } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { environment } from '../../environments/environment';
import { Scopes } from '../api/rvn-auth/scopes';
import { SecuritySchemeType } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
@Injectable()
export class SwaggerService {
  public enableSwagger(
    app: INestApplication,
    apiRoot: string,
    version: string,
  ): void {
    const jsonPath = apiRoot ? `/${apiRoot}-json` : '/-json';
    const options = {
      type: 'oauth2' as SecuritySchemeType,
      flows: {
        authorizationCode: {
          authorizationUrl: `${environment.azureAd.authority}/oauth2/v2.0/authorize`,
          tokenUrl: `${environment.azureAd.authority}/oauth2/v2.0/token`,
          scopes: {
            openid: 'openid',
          },
        },
      },
    };
    options.flows.authorizationCode['scopes'][Scopes.apiAccess()] =
      'Access Raven Api';

    const config = new DocumentBuilder()
      .setTitle('Raven')
      .setDescription(
        `Raven API - <a href="${jsonPath}" target="_blank">openapi.json</a>`,
      )
      .setVersion(version)
      .addOAuth2(options)
      .build();
    const serverUrl = environment.app.apiUrl;
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        oauth2RedirectUrl: `${serverUrl}/${apiRoot}/oauth2-redirect.html`,
        initOAuth: {
          clientId: environment.azureAd.clientId,
          scopes: [Scopes.apiAccess()],
          usePkceWithAuthorizationCodeGrant: true,
        },
        operationsSorter: (a, b) => {
          const methodPriority = {
            get: '1',
            post: '2',
            patch: '3',
            put: '4',
            delete: '5',
          };
          return methodPriority[a.get('method')].localeCompare(
            methodPriority[b.get('method')],
          );
        },
      },
      customSiteTitle: 'Raven API Docs',
    };
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(apiRoot, app, document, customOptions);
  }
}
