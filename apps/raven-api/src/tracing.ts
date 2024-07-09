import {
  AzureMonitorOpenTelemetryOptions,
  useAzureMonitor,
} from '@azure/monitor-opentelemetry';
import { Resource } from '@opentelemetry/resources';
import {
  SEMRESATTRS_SERVICE_INSTANCE_ID,
  SEMRESATTRS_SERVICE_NAME,
} from '@opentelemetry/semantic-conventions';
import * as env from 'env-var';

let customResource: Resource = new Resource({});
if (
  env.get('LOCAL_INSTANCE_NAME').default('undefined').asString() !== 'undefined'
) {
  customResource = customResource.merge(
    new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'as-wa-mc-raven-dev',
      [SEMRESATTRS_SERVICE_INSTANCE_ID]: env
        .get('LOCAL_INSTANCE_NAME')
        .asString(),
    }),
  );
}

// Create a new AzureMonitorOpenTelemetryOptions object.
const options: AzureMonitorOpenTelemetryOptions = {
  instrumentationOptions: {
    azureSdk: { enabled: true },
  },
  azureMonitorExporterOptions: {
    connectionString: env
      .get('APPLICATIONINSIGHTS_CONNECTION_STRING')
      .asString(),
  },
  resource: customResource,
  samplingRatio: 1,
};

// Enable Azure Monitor integration using the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions object.
useAzureMonitor(options);

import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { BullMQProInstrumentation } from 'opentelemetry-instrumentation-bullmqpro';
import { TypeormInstrumentation } from 'opentelemetry-instrumentation-typeorm';

registerInstrumentations({
  // List of instrumentations to register
  instrumentations: [
    new NestInstrumentation(),
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new IORedisInstrumentation(), // for ioredis instrumentation
    new TypeormInstrumentation(), // for typeorm instrumentation
    new BullMQProInstrumentation(),
  ],
});
