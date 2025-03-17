const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const rootPath = process.cwd();
const srcPath = path.join(rootPath, 'src');

const envVars = Object.keys(process.env)
  .filter((key) => key.startsWith('APP_'))
  .reduce((envObj, key) => {
    envObj[`process.env.${key}`] = JSON.stringify(process.env[key]);
    return envObj;
  }, {});

console.log({ envVars });

module.exports = {
  entry: path.join(srcPath, 'index.tsx'),
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    path: path.join(rootPath, 'dist'),
    clean: true,
    publicPath: '/'
  },
  cache: {
    type: 'filesystem'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        include: [srcPath],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript'
              ]
            }
          }
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/images/[name][ext]'
        }
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/fonts/[name][ext]'
        }
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/media/[name][ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      src: srcPath
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootPath, 'public', 'index.html'),
      inject: true
    }),
    new webpack.DefinePlugin(envVars),
    new ForkTsCheckerWebpackPlugin(),
    new ESLintPlugin({ extensions: ['ts', 'tsx'] })
  ]
};
