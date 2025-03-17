const path = require('path');
const globAll = require('glob-all');
const { merge } = require('webpack-merge');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const dotenv = require('dotenv');

const rootPath = process.cwd();
const srcPath = path.join(rootPath, 'src');

dotenv.config({
  path: path.resolve(rootPath, '.env.prod')
});

module.exports = merge(require('./webpack.common.js'), {
  mode: 'production',
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
          },
          {
            test: /\.less$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            pure_funcs: ['console.log']
          }
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          name: 'vendors',
          minChunks: 1,
          chunks: 'initial',
          minSize: 0,
          priority: 1
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          chunks: 'initial',
          minSize: 0
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join(rootPath, 'public'),
          to: path.join(rootPath, 'dist'),
          filter: (source) => {
            return !source.includes('index.html');
          }
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[chunkhash:8].css'
    }),
    new PurgeCSSPlugin({
      paths: globAll.sync([`${srcPath}/**/*.tsx`, path.join(rootPath, 'public', 'index.html')])
    }),
    new CompressionPlugin({
      test: /.(js|css)$/,
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /.(js|css)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
});
