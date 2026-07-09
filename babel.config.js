const path = require('path');
const appDir = path.join(__dirname, 'apps/mobile');

// Resuelve plugins desde el directorio de la app donde están instalados
function resolvePlugin(name) {
  return require.resolve(name, { paths: [appDir] });
}

module.exports = function (api) {
  api.cache(true);

  return {
    presets: [[resolvePlugin('babel-preset-expo'), {}]],
    plugins: [
      [
        resolvePlugin('@tamagui/babel-plugin'),
        {
          components: ['tamagui'],
          config: path.join(appDir, 'src/theme/index.ts'),
          logTimings: true,
          // Extraction is a production/dev bundling optimization; disable it
          // under Jest too so component tests exercise real runtime prop
          // evaluation instead of the compile-time-optimized JSX.
          disableExtraction:
            process.env.NODE_ENV === 'development' ||
            process.env.NODE_ENV === 'test',
        },
      ],
      resolvePlugin('react-native-reanimated/plugin'),
    ],
  };
};
