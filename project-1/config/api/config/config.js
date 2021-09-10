const env = process.env.FE_ENV || 'local';

process.env.TZ = 'Asia/Taipei';

if (env === 'local') {
  require('dotenv').config({ path: 'api/.env.local' });
}

const AC_URL = {
  lab: 'https://sso.104-dev.com.tw/samlsso',
  ol: 'https://sso.104-staging.com.tw/samlsso',
  prod: 'https://sso.104.com.tw/samlsso;'
};

const OIDC_URL = {
  lab: 'https://oidc.104-dev.com.tw',
  ol: 'https://oidc.104-staging.com.tw',
  prod: 'https://oidc.104.com.tw'
};

const PLUS_URL = {
  lab: 'https://c1.plus.104-dev.com.tw',
  stg: 'https://c1.plus.104-staging.com.tw',
  prod: 'https://c1.plus.104.com.tw'
};

const OIDC_CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET;

const API_URL = {
  dev: 'http://10.152.161.247:8080',
  stg: 'http://10.144.162.76:8080',
  prod: 'https://top.104dc.com',
  test: 'http://localhost:8080'
};

const AREA_CAT_URL = {
  lab: 'https://static.104-dev.com.tw/category-tool/json/Area.json',
  stg: 'https://static.104-staging.com.tw/category-tool/json/Area.json',
  prod: 'https://static.104.com.tw/category-tool/json/Area.json',
};

const INDUST_CAT_URL = {
  lab: 'https://static.104-dev.com.tw/category-tool/json/Indust.json',
  stg: 'https://static.104-staging.com.tw/category-tool/json/Indust.json',
  prod: 'https://static.104.com.tw/category-tool/json/Indust.json',
};

const TWILIO_FCM_SID = {
  dev: 'CR8608f7db81e71964adb3cea705711145',
  stg: 'CR92e685bd6815bd0929cff4b94cc42ae4',
  prod: 'CR812e8752845ea5b0d9bbd2653c387452',
  test: 'CR8608f7db81e71964adb3cea705711145'
};

const TWILIO_TOKEN_TTL = {
  lab: 600, // 10 min
  stg: 86400, // 24hr
  prod: 86400, // 24hr
};

const WINSTON_CONFIG = {
  NAME: 'node-api-logs',
  FILE_NAME: {
    dev: '/logs/api-logs.log',
    stg: '/logs/api-logs.log',
    prod: '/logs/api-logs.log',
    test: 'logs/api-logs.log'
  },
  MAX_SIZE: {
    dev: '5m',
    stg: '5m',
    prod: '5m',
    test: '5m'
  },
  MAX_FILES: {
    dev: '14d',
    stg: '14d',
    prod: '14d',
    test: '7d'
  },
  // https://github.com/winstonjs/winston#logging-levels
  LOG_LEVEL: {
    CONSOLE: {
      dev: 'debug',
      stg: 'debug',
      prod: 'error',
      test: 'debug'
    },
    FILE: {
      dev: 'debug',
      stg: 'debug',
      prod: 'error',
      test: 'debug'
    }
  }
};

const setting = {
  local: {
    app: {
      name: 'freebird API proxy (local)',
      port: process.env.PORT || 3001,
      env: 'local'
    },
    backend: {
      domain: API_URL.dev
      // domain: API_URL.test
    },
    saml: {
      protocol: 'http://',
      url: AC_URL.lab,
      issuer: 'topLocal'
    },
    oidc: {
      url: OIDC_URL.lab,
      redirect_url: 'http://top.localhost:3000/api/oidc/callback',
      initiated_redirect_url: 'http://top.localhost:3000/api/oidc/initiating-callback',
      post_logout_redirect_uri: 'http://top.localhost:3000/api/logout',
      login_relay: '/loginSuccess-dev.html',
      client_id: 'top',
      clientSecret: OIDC_CLIENT_SECRET,
      plus_url: PLUS_URL.lab
    },
    static: {
      area_url: AREA_CAT_URL.lab,
      indust_url: INDUST_CAT_URL.lab
    },
    twilio: {
      fcm: TWILIO_FCM_SID.test,
      ttl: TWILIO_TOKEN_TTL.lab,
    },
    winston: {
      fileName: WINSTON_CONFIG.FILE_NAME.test,
      maxSize: WINSTON_CONFIG.MAX_SIZE.test,
      maxFiles: WINSTON_CONFIG.MAX_FILES.test,
      logLevelConsole: WINSTON_CONFIG.LOG_LEVEL.CONSOLE.test,
      logLevelFile: WINSTON_CONFIG.LOG_LEVEL.FILE.test,
    },
    cors: false,
    openIdSW: true,
  },
  develop: {
    app: {
      name: 'freebird API proxy (develop)',
      port: process.env.PORT || 3001,
      env: 'develop'
    },
    backend: {
      domain: API_URL.dev
      // domain: API_URL.test
    },
    saml: {
      protocol: 'https://',
      url: AC_URL.lab,
      issuer: 'topLab'
    },
    oidc: {
      url: OIDC_URL.lab,
      redirect_url: 'https://top.104-dev.com.tw/api/oidc/callback',
      initiated_redirect_url: 'https://top.104-dev.com.tw/api/oidc/initiating-callback',
      post_logout_redirect_uri: 'https://top.104-dev.com.tw/api/logout',
      login_relay: '/loginSuccess-dev.html',
      client_id: 'top',
      clientSecret: OIDC_CLIENT_SECRET,
      plus_url: PLUS_URL.lab
    },
    static: {
      area_url: AREA_CAT_URL.lab,
      indust_url: INDUST_CAT_URL.lab
    },
    twilio: {
      fcm: TWILIO_FCM_SID.dev,
      ttl: TWILIO_TOKEN_TTL.lab,
    },
    winston: {
      fileName: WINSTON_CONFIG.FILE_NAME.dev,
      maxSize: WINSTON_CONFIG.MAX_SIZE.dev,
      maxFiles: WINSTON_CONFIG.MAX_FILES.dev,
      logLevelConsole: WINSTON_CONFIG.LOG_LEVEL.CONSOLE.dev,
      logLevelFile: WINSTON_CONFIG.LOG_LEVEL.FILE.dev,
    },
    cors: false,
    openIdSW: true,
  },
  staging: {
    app: {
      name: 'freebird API proxy (staging)',
      port: process.env.PORT || 3001,
      env: 'staging'
    },
    backend: {
      domain: API_URL.stg
    },
    saml: {
      protocol: 'https://',
      url: AC_URL.ol,
      issuer: 'topStaging'
    },
    oidc: {
      url: OIDC_URL.ol,
      redirect_url: 'https://top.104-staging.com.tw/api/oidc/callback',
      initiated_redirect_url: 'https://top.104-staging.com.tw/api/oidc/initiating-callback',
      post_logout_redirect_uri: 'https://top.104-staging.com.tw/api/logout',
      login_relay: '/loginSuccess-stg.html',
      client_id: 'top',
      clientSecret: OIDC_CLIENT_SECRET,
      plus_url: PLUS_URL.stg
    },
    static: {
      area_url: AREA_CAT_URL.stg,
      indust_url: INDUST_CAT_URL.stg
    },
    twilio: {
      fcm: TWILIO_FCM_SID.stg,
      ttl: TWILIO_TOKEN_TTL.stg,
    },
    winston: {
      fileName: WINSTON_CONFIG.FILE_NAME.stg,
      maxSize: WINSTON_CONFIG.MAX_SIZE.stg,
      maxFiles: WINSTON_CONFIG.MAX_FILES.stg,
      logLevelConsole: WINSTON_CONFIG.LOG_LEVEL.CONSOLE.stg,
      logLevelFile: WINSTON_CONFIG.LOG_LEVEL.FILE.stg,
    },
    cors: false,
    openIdSW: true,
  },
  production: {
    app: {
      name: 'freebird API proxy',
      port: process.env.PORT || 3001,
      env: 'production'
    },
    backend: {
      domain: API_URL.prod
    },
    saml: {
      protocol: 'https://',
      url: AC_URL.prod,
      issuer: 'top'
    },
    oidc: {
      url: OIDC_URL.prod,
      redirect_url: 'https://top.104.com.tw/api/oidc/callback',
      initiated_redirect_url: 'https://top.104.com.tw/api/oidc/initiating-callback',
      post_logout_redirect_uri: 'https://top.104.com.tw/api/logout',
      login_relay: '/loginSuccess-prod.html',
      client_id: 'top',
      clientSecret: OIDC_CLIENT_SECRET,
      plus_url: PLUS_URL.prod
    },
    static: {
      area_url: AREA_CAT_URL.prod,
      indust_url: INDUST_CAT_URL.prod
    },
    twilio: {
      fcm: TWILIO_FCM_SID.prod,
      ttl: TWILIO_TOKEN_TTL.prod,
    },
    winston: {
      fileName: WINSTON_CONFIG.FILE_NAME.prod,
      maxSize: WINSTON_CONFIG.MAX_SIZE.prod,
      maxFiles: WINSTON_CONFIG.MAX_FILES.prod,
      logLevelConsole: WINSTON_CONFIG.LOG_LEVEL.CONSOLE.prod,
      logLevelFile: WINSTON_CONFIG.LOG_LEVEL.FILE.prod,
    },
    cors: false,
    openIdSW: true,
  }
};

module.exports = setting[env];
