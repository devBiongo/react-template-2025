const { merge } = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.config.base.js');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const rootPath = process.cwd();
// 合并公共配置,并添加开发环境配置
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map', // 源码调试模式,后面会讲
  devServer: {
    port: 3000,
    // host: '0.0.0.0',
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    hot: true, // 开启热更新，后面会讲react模块热替换具体配置
    historyApiFallback: true, // 解决history路由404问题
    static: {
      directory: path.join(rootPath, 'public') //托管静态资源public文件夹
    }
  },
  plugins: [
    new ReactRefreshWebpackPlugin() // 添加热更新插件
  ]
});
