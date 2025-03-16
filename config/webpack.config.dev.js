const { merge } = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.config.base.js');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const rootPath = process.cwd();

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 3000,
    // host: '0.0.0.0',
    compress: false, // gzip minification
    hot: true,
    historyApiFallback: true, // resolve 404
    static: {
      directory: path.join(rootPath, 'public') // Host static assets in the public folder
    }
  },
  plugins: [new ReactRefreshWebpackPlugin()]
});
