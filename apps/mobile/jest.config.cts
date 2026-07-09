/// <reference types="jest" />
/// <reference types="node" />
module.exports = {
  displayName: '@org/mobile',
  // @react-native/jest-preset (not jest-expo) — sidesteps a pre-existing
  // jest-expo/Node incompatibility (its "winter" fetch polyfill throws under
  // this Node version, even for pure-logic tests with no rendering).
  preset: '@react-native/jest-preset',
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '[.]svg$': '@nx/expo/plugins/jest/svg-mock',
  },
  transform: {
    '[.][jt]sx?$': [
      'babel-jest',
      {
        configFile: __dirname + '/../../babel.config.js',
      },
    ],
    '^.+[.](bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp|ttf|otf|m4v|mov|mp4|mpeg|mpg|webm|aac|aiff|caf|m4a|mp3|wav|html|pdf|obj)$':
      require.resolve('jest-expo/src/preset/assetFileTransformer.js'),
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@?tamagui|expo(nent)?[^/]*|@expo(nent)?[^/]*/.*|@react-navigation)/)',
  ],
  coverageDirectory: '../../coverage/apps/mobile',
};
