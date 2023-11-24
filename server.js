const express = require('express');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
const port = process.env.PORT || 9990;
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./config')

const app = express();

app.use(history());
app.use('/api', createProxyMiddleware({
  target: config.API,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/'
  }
}));
app.use(serveStatic(__dirname + '/dist/spa'));

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
})
