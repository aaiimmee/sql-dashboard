const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function(config){
  config.plugins.push(new MonacoWebpackPlugin())
  return config
}

