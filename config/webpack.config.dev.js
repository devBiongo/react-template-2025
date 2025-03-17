const { merge } = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.config.base.js');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 3000,
    compress: false,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(process.cwd(), 'public')
    }
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader']
          },
          {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
          }
        ]
      }
    ]
  },
  plugins: [new ReactRefreshWebpackPlugin()]
});
