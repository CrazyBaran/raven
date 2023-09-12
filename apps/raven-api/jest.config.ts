/* eslint-disable */
export default {
  displayName: 'raven-api',
  preset: '../../jest.preset.js',
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test_reports',
        outputName: 'junit-api.xml',
      },
    ],
  ],
  coverageDirectory: '../../coverage/apps/raven-api',
  coverageReporters: ['text', 'html', 'cobertura'],
};
