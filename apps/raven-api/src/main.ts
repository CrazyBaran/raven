import * as env from 'env-var';
import { AzureMonitorOpenTelemetryOptions, useAzureMonitor } from '@azure/monitor-opentelemetry';
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";


const customResource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "as-wa-mc-raven-dev",
  [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: "jakub-local-dev",
});

// Create a new AzureMonitorOpenTelemetryOptions object.
const options: AzureMonitorOpenTelemetryOptions = {
  instrumentationOptions: {
    azureSdk: { enabled: true },
  },
  azureMonitorExporterOptions: {
    connectionString: env.get('APPLICATIONINSIGHTS_CONNECTION_STRING').asString(),
  },
  resource: customResource,
  samplingRatio: 1,
};

const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");





// Enable Azure Monitor integration using the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions object.
useAzureMonitor(options);

import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { IORedisInstrumentation } from "@opentelemetry/instrumentation-ioredis";
import { TypeormInstrumentation } from "opentelemetry-instrumentation-typeorm";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core";
import { BullMQProInstrumentation } from 'opentelemetry-instrumentation-bullmqpro';


registerInstrumentations({
  // List of instrumentations to register
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new NestInstrumentation(),
    new IORedisInstrumentation(), // for ioredis instrumentation
    new TypeormInstrumentation(), // for typeorm instrumentation
    new BullMQProInstrumentation(),
  ],
});

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

import "reflect-metadata";
import "isomorphic-fetch";
import helmet from "helmet";
import * as bodyParser from "body-parser";

import { AppModule } from "./app/core/app.module";
import { BullService } from "./app/core/bull.service";
import { SwaggerService } from "./app/core/swagger.service";
import { environment } from "./environments/environment";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { EventEmitter2 } from "@nestjs/event-emitter";
import cookieParser from "cookie-parser";

async function bootstrap(): Promise<void> {
  // increase max listeners per event
  EventEmitter2.defaultMaxListeners = 20;
  // configure app
  const version = "0.5.0";
  const app = await NestFactory.create(AppModule, {
    cors: { origin: environment.app.url, credentials: true }
  });
  const globalPrefix = environment.app.apiPrefix;
  const bullBoardPath = "bg";
  const swaggerPath = "swagger";
  app
    .setGlobalPrefix(globalPrefix)
    .use(helmet({
      frameguard: { action: "deny" },
      crossOriginOpenerPolicy: {
        policy: 'unsafe-none',
      },
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': [ '\'self\'', '\'sha256-4IiDsMH+GkJlxivIDNfi6qk0O5HPtzyvNwVT3Wt8TIw=\'' ],
          'connect-src': [
            '\'self\'',
            `${environment.azureAd.authority}/oauth2/v2.0/token`,
          ],
        },
      },
    }))
    .use(bodyParser.json({ limit: "10mb" }))
    .use(cookieParser(environment.security.cookies.secret))
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        // this is required to make entity pipes to work
        forbidUnknownValues: false,
        transformOptions: {
          enableImplicitConversion: true
        }
      })
    );

  // enable services
  if (environment.app.enableSwagger) {
    app.get<SwaggerService>(SwaggerService).enableSwagger(app, swaggerPath, version);
  }
  if (environment.bull.board.enable) {
    app.get<BullService>(BullService).enableBullBoard(app, bullBoardPath);
  }

  // start app
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log(
      [
        `🚀 Raven API is running on: http://localhost:${port}`,
        environment.app.enableSwagger
          ? `, swagger: http://localhost:${port}/${swaggerPath}`
          : "",
        environment.bull.board.enable
          ? `, bull: http://localhost:${port}/${bullBoardPath}`
          : ""
      ].join("")
    );
  });
}

bootstrap();
