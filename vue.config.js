const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  // 开发服务器配置
  devServer: {
    port: 5029,
    client: {
      overlay: false,
    },
  },
  pluginOptions: {},
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
          new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|png|svg)$/, // 匹配压缩文件类型
            threshold: 10240 // 超过 10KiB 的文件才压缩
          })
      );
    }
  },
};