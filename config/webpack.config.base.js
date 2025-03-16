const dotenv = require('dotenv');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const rootPath = process.cwd();
const srcPath = path.join(rootPath, 'src');
const isDev = process.env.NODE_ENV === 'production';

dotenv.config({
  path: path.resolve(rootPath, isDev ? '.env.prod' : '.env.dev')
});

const envVars = Object.keys(process.env)
  .filter((key) => key.startsWith('APP_'))
  .reduce((envObj, key) => {
    envObj[`process.env.${key}`] = JSON.stringify(process.env[key]);
    return envObj;
  }, {});

function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

module.exports = {
  entry: path.join(srcPath, 'index.tsx'),
  output: {
    filename: `static/js/${generateTimestamp()}.[chunkhash:8].js`,
    path: path.join(rootPath, 'dist'),
    clean: true,
    publicPath: '/' // 打包后文件的公共前缀路径
  },
  cache: {
    type: 'filesystem' // 使用文件缓存
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/,
        include: [srcPath],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
              ]
            }
          }
        ]
      },
      {
        test: /.css$/,
        include: [srcPath],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /.less$/,
        include: [srcPath],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb转base64位
          }
        },
        generator: {
          filename: 'static/images/[name][ext]'
        }
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
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
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
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
    extensions: ['.js', '.tsx', '.ts'],
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
