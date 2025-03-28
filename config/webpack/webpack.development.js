const path = require('path');
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(process.cwd(), '.env.dev')
});

module.exports = merge(require('./webpack.common.js'), {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 3003,
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
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: true
                }
              },
              'postcss-loader'
            ]
          },
          {
            test: /\.less$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: true
                }
              },
              'postcss-loader',
              'less-loader'
            ]
          }
        ]
      }
    ]
  },
  plugins: [new ReactRefreshWebpackPlugin()]
});
