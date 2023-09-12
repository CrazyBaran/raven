/* eslint-disable */
export default {
  displayName: 'raven-client',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test_reports',
        outputName: 'junit-client.xml',
      },
    ],
  ],
  coverageDirectory: '../../coverage/apps/raven-client',
  coverageReporters: ['text', 'html', 'cobertura'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
