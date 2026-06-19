const path = require('path');
const appDir = path.join(__dirname, 'apps/mobile');

// Resuelve plugins desde el directorio de la app donde están instalados
function resolvePlugin(name) {
  return require.resolve(name, { paths: [appDir] });
}

module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [resolvePlugin('babel-preset-expo'), {}],
    ],
    plugins: [
      [
        resolvePlugin('@tamagui/babel-plugin'),
        {
          components: ['tamagui'],
          config: path.join(appDir, 'src/theme/index.ts'),
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
      resolvePlugin('react-native-reanimated/plugin'),
    ],
  };
};
