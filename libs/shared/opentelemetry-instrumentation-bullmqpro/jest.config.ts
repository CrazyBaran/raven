/* eslint-disable */
export default {
  displayName: 'opentelemetry-instrumentation-bullmqpro',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../coverage/libs/shared/opentelemetry-instrumentation-bullmqpro',
};
