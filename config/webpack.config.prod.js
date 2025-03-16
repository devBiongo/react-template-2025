const { merge } = require('webpack-merge');
const path = require('path');
const globAll = require('glob-all');
const baseConfig = require('./webpack.config.base.js');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const rootPath = process.cwd();
const srcPath = path.join(rootPath, 'src');

module.exports = merge(baseConfig, {
  mode: 'production',
  optimization: {
    minimizer: [
      // CSS minification
      new CssMinimizerPlugin(),
      // JS minification
      new TerserPlugin({
        parallel: true, // Enable multi-threaded compression
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'] // remove console.log
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
      paths: globAll.sync([`${srcPath}/**/*.tsx`, path.join(rootPath, 'public', 'index.html')]),
      safelist: {
        standard: [/^ant-/]
      }
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
