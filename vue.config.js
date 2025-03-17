const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },  // 确保路径匹配
        onProxyReq: (proxyReq) => {
          proxyReq.removeHeader('referer');  // 移除可能被拦截的请求头
          proxyReq.removeHeader('origin');
        }
      }
    }
  }
}
