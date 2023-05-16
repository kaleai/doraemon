const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/gadget',
    createProxyMiddleware({
      target: 'http://localhost:7031',
      changeOrigin: true,
      headers: {
        'Sec-Fetch-Mode': 'no-cors'
      }
    })
  );
}
