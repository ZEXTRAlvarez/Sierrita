const { withNxMetro } = require('@nx/expo');
const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require('metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  cacheVersion: '@org/mobile',
  projectRoot: __dirname,
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'cjs', 'mjs', 'svg'],
  },
};

const path = require('path');
const workspaceRoot = path.resolve(__dirname, '../..');

const nxConfig = withNxMetro(mergeConfig(defaultConfig, customConfig), {
  debug: false,
  extensions: [],
  // Incluye libs/ del monorepo para que Metro pueda resolver @sierrita/* paths
  watchFolders: [path.join(workspaceRoot, 'libs')],
});

// withNxMetro sobreescribe projectRoot al workspace root — lo restauramos
nxConfig.projectRoot = __dirname;
nxConfig.watchFolders = [
  ...(nxConfig.watchFolders || []),
  workspaceRoot,
];

module.exports = nxConfig;
