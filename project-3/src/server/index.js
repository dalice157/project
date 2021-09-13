const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('./helmet');
// const config = require('config')

// const csrf = require('./csrf')

const api = require('./api').app;
//
const healthCheck = require('./healthCheck');
// const consultantEzpay = require('./consultantEzpay')
const nuxt = require('./nuxt');
// const { logger } = require('./logger');
const app = express();

async function start() {
  app.use(bodyParser.json({ limit: '100mb' }))
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
  app.use(cookieParser())
  helmet(app)
  app.set('trust proxy', 1)

  // 增加 middleware 時請注意使用順序！
  healthCheck(app);
  // consultantEzpay(app);
  api(app);
  // csrf(app);
  const NuxtClass = await nuxt(app)
  const { host, port } = NuxtClass.options.server;
  app.listen(port, host);
  // logger.info({ serverRun: true, host, port, msg: `Server listening on http://${host}:${port}` })
}

start();
