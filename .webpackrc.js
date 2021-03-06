const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  externals: {
    '@antv/data-set': 'DataSet',
    rollbar: 'rollbar',
  },
  alias: {
    assets: path.resolve(__dirname, 'src/assets/'),
    common: path.resolve(__dirname, 'src/common/'),
    components: path.resolve(__dirname, 'src/components/'),
    layouts: path.resolve(__dirname, 'src/layouts/'),
    models: path.resolve(__dirname, 'src/models/'),
    routes: path.resolve(__dirname, 'src/routes/'),
    services: path.resolve(__dirname, 'src/services/'),
    utils: path.resolve(__dirname, 'src/utils/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,

  proxy: {
    '/api': {
      target: 'http://172.28.60.14:8290',
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    },
  },
};
