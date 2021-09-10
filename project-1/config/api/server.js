const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieEncrypter = require('cookie-encrypter')
const redis = require('redis');
const session = require('express-session');
const helmet = require('helmet');
const passport = require('passport');

require('isomorphic-fetch'); // global

console.log('\r\n/********* Start Server.js of api **********/');

// Web context init.
const app = express();
const config = require('./config/config');
const auth = config.openIdSW ? require('./config/oidc-auth.js') : require('./config/auth.js');
const viewCounter = require('./config/user-ip');
const logger = require('./config/logger.js');
const secretKey = 'mklRCawdawR2Adaadbarbaz123456768';
let sessionStore = {};

// middleware register
app.use(helmet());
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       frameAncestors: [
//         '*.104-dev.com.tw:*'
//       ]
//     }
//   },
//   frameguard: true
// }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(secretKey));
app.use(cookieEncrypter(secretKey))

let getRedisConfig;

(async function () {
  getRedisConfig = require('./config/redis');
  let redisConfig = await getRedisConfig;
  redisConfig = redisConfig.trim();
  const redisConfigObj = JSON.parse(redisConfig);
  // console.log(redisConfigObj);

  const redisClient = redis.createClient(redisConfigObj.port, redisConfigObj.host, {
    no_ready_check: true
  });

  redisClient.on("error", function (err) {
    console.error("Error " + err);
  });

  if (config.openIdSW) {
    let RedisStore = require('connect-redis')(session);
    sessionStore = new RedisStore({ client: redisClient });

    app.use(session({
      name: '_top',
      store: sessionStore,
      secret: secretKey,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
    }));
  }

  app.use(require("morgan")("tiny", { "stream": logger.stream }));

  //use CORS
  if (config.cors)
    require('./config/cors')(app);

  if (config.openIdSW) {
    //use OpenID
    require('./config/oidc-client')(passport, sessionStore, config);
    app.use(passport.initialize());
    app.use(passport.session());
  } else {
    //use SAML
    require('./config/passport')(passport, config);
    app.use(passport.initialize());
    // app.use(passport.session());
  }

  // console.log('oidcClient', oidcClient);
  app.get('/', (req, res) => {
    //  res.set({
    //   'Content-Security-Policy': 'frame-ancestors *.104-dev.com.tw',
    // })
    res.send('Hello World');
  });

  app.use(express.static('public'));

  if (config.openIdSW) {
    app.use(require('./controllers/oidc.js')(express.Router(), passport, sessionStore));
  } else {
    app.use(require('./controllers/saml.js')(express.Router(), passport));
  }

  app.use('/api', viewCounter(redisClient), require('./controllers/common-proxy.js'));
  app.use('/api', require('./controllers/marketing-proxy.js'));
  app.use('/api', auth(false), require('./controllers/auth-proxy.js'));
  app.use('/api', auth(), require('./controllers/basic-proxy.js'));
  app.use('/api', auth(), require('./controllers/chatmeta-proxy.js'));
  app.use('/api', auth(), require('./controllers/report-proxy.js'));
  app.use('/api', auth(), require('./controllers/demand-proxy.js'));
  app.use('/api', auth(), require('./controllers/profile-proxy.js'));
  app.use('/api', auth(), require('./controllers/twilio-proxy.js'));
  app.use('/api', auth(), require('./controllers/verify-proxy.js'));
  app.use('/api', auth(), require('./controllers/collection-proxy.js'));
  app.use('/api', auth(), require('./controllers/introduct-proxy.js'));
  app.use('/api', auth(), require('./controllers/setting-proxy.js'));
  app.use('/api', auth(), viewCounter(redisClient), require('./controllers/case-proxy.js'));
  app.use('/api', auth(), viewCounter(redisClient), require('./controllers/gigManage-proxy.js'));

  // HTTP server
  const server = app.listen(config.app.port, () => {
    console.log('\r\n/************* Start Progress **************/');
    console.log(`API Server (${config.app.name}) Started at ${config.app.port}...\r\n`);
  })

  module.exports = server;
})();
