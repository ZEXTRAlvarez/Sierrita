/// <reference types="jest" />
module.exports = {
  displayName: 'ui',
  // react-native's own preset (not jest-expo) — this lib only renders plain
  // RN/Tamagui components and doesn't need Expo's native module mocks, which
  // sidesteps a pre-existing jest-expo/Node incompatibility (its "winter"
  // fetch polyfill throws under this Node version — reproduced independently
  // on the untouched @org/mobile:test suite, so it's not specific to this lib).
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  transform: {
    '[.][jt]sx?$': [
      'babel-jest',
      {
        configFile: __dirname + '/../../babel.config.js',
      },
    ],
  },
  // Tamagui ships ESM in node_modules; the default RN preset only unignores
  // react-native itself, so extend it to also transform tamagui's packages.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@?tamagui)/)',
  ],
  coverageDirectory: '../../coverage/libs/ui',
};
