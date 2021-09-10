import { productsObj } from './constant';

const env = process.env.REACT_APP_NODE_ENV_CLIENT || 'development';

console.log(`env is ${env}`);

const LOGO_WHITE_URL = {
  local: '//static.104.com.tw/top/top-logo-w.png',
  lab: '//static.104.com.tw/top/top-logo-w.png',
  stg: '//static.104.com.tw/top/top-logo-w.png',
  prod: '//static.104.com.tw/top/top-logo-w.png',
};

const LOGO_BLACK_URL = {
  local: '//static.104.com.tw/top/top-logo-b.png',
  lab: '//static.104.com.tw/top/top-logo-b.png',
  stg: '//static.104.com.tw/top/top-logo-b.png',
  prod: '//static.104.com.tw/top/top-logo-b.png',
};

const API_URL = {
  local: 'http://localhost:3001/poc-api',
  lab: '/api',
  stg: '/api',
  prod: '/api',
};

const DOUCTMENT_S3 = {
  lab: 'https://ori.doc.104-dev.com.tw',
  stg: 'https://ori.doc.104-staging.com.tw',
  prod: 'https://ori.doc.104.com.tw',
};

const ACCOUNTS_SITE = {
  lab: 'https://accounts.104-dev.com.tw/login',
  stg: 'https://accounts.104-staging.com.tw/login',
  prod: 'https://accounts.104.com.tw/login',
};

const PAYMENT_SITE = {
  lab: 'https://pro.104-dev.com.tw',
  stg: 'https://pro.104-staging.com.tw',
  prod: 'https://pro.104.com.tw',
};

const PROFILE_SITE = {
  lab: 'https://plus.104-dev.com.tw',
  stg: 'https://plus.104-staging.com.tw',
  prod: 'https://plus.104.com.tw',
};

const WP_SITE = {
  lab: 'https://blog.top.104.com.tw',
  stg: 'https://blog.top.104.com.tw',
  prod: 'https://blog.top.104.com.tw',
};

const TOP_SITE = {
  local: 'http://top.localhost:3000',
  lab: 'https://top.104-dev.com.tw',
  stg: 'https://top.104-staging.com.tw',
  prod: 'https://top.104.com.tw',
};

const REGISTER = {
  local: 'https://signin.104-dev.com.tw/register',
  lab: 'https://signin.104-dev.com.tw/register',
  stg: 'https://signin.104-staging.com.tw/register',
  prod: 'https://signin.104.com.tw/register',
};

const BILLING = {
  local: 'https://billing.104-dev.com.tw/js/app.js',
  lab: 'https://billing.104-dev.com.tw/js/app.js',
  stg: 'https://billing.104-staging.com.tw/js/app.js',
  prod: 'https://billing.104.com.tw/js/app.js',
};

const FIREBASE_MESSAGE_SENDER_ID = {
  local: '884439017905',
  lab: '884439017905',
  stg: '457660387231',
  prod: '733061114611',
};


const PRODUCTS = {
  lab: productsObj.lab,
  stg: productsObj.stg,
  prod: productsObj.prod,
};

/**
 * debug 工具
 * - reduxLogger
 */
const debug = {
  reduxLogger: {
    local: true,
    lab: true,
    stg: true,
    prod: false,
  },
};

/**
 * 功能開關：全為 true 時，盤點相關程式碼並移除後，就沒有存在的必要了
 * - service
 * - case
 */
const featureSwitch = {
  VL10160: {
    lab: true,
    stg: true,
    prod: true,
  },
};

/**
 * 設定邀請高手50人限制
 * 只有在 prod 時是使用 50 人
 * 其餘使用 10 人
 */
const INVITING_LIMIT = {
  lab: 25,
  stg: 25,
  prod: 50,
};

const setting = {
  development: {
    app: {
      name: 'Buddy FE (local)',
    },
    logoWhite: {
      url: LOGO_WHITE_URL.local,
    },
    logoBlack: {
      url: LOGO_BLACK_URL.local,
    },
    proxyAPI: {
      domain: API_URL.local,
    },
    paymentSite: {
      domain: PAYMENT_SITE.lab,
    },
    profileSite: {
      domain: PROFILE_SITE.lab,
    },
    contentSite: {
      domain: WP_SITE.lab,
    },
    topSite: {
      domain: TOP_SITE.local,
    },
    document: {
      s3: DOUCTMENT_S3.lab,
    },
    accountsSite: {
      domain: ACCOUNTS_SITE.lab,
    },
    firebase: {
      message_sender_id: FIREBASE_MESSAGE_SENDER_ID.local,
    },
    debugReduxLogger: debug.reduxLogger.local,
    register: {
      domain: REGISTER.local,
    },
    billing: {
      domain: BILLING.local,
    },
    products: {
      json: PRODUCTS.lab,
    },
    featureSwitch: {
      VL10160: featureSwitch.VL10160.lab,
    },
    INVITING_LIMIT: INVITING_LIMIT.lab,
  },
  develop: {
    app: {
      name: 'Buddy FE (develop)',
    },
    logoWhite: {
      url: LOGO_WHITE_URL.lab,
    },
    logoBlack: {
      url: LOGO_BLACK_URL.lab,
    },
    proxyAPI: {
      domain: API_URL.lab,
    },
    paymentSite: {
      domain: PAYMENT_SITE.lab,
    },
    profileSite: {
      domain: PROFILE_SITE.lab,
    },
    contentSite: {
      domain: WP_SITE.lab,
    },
    topSite: {
      domain: TOP_SITE.lab,
    },
    document: {
      s3: DOUCTMENT_S3.lab,
    },
    accountsSite: {
      domain: ACCOUNTS_SITE.lab,
    },
    firebase: {
      message_sender_id: FIREBASE_MESSAGE_SENDER_ID.lab,
    },
    debugReduxLogger: debug.reduxLogger.lab,
    register: {
      domain: REGISTER.lab,
    },
    billing: {
      domain: BILLING.lab,
    },
    products: {
      json: PRODUCTS.lab,
    },
    featureSwitch: {
      VL10160: featureSwitch.VL10160.lab,
    },
    INVITING_LIMIT: INVITING_LIMIT.lab,
  },
  staging: {
    app: {
      name: 'Buddy FE (staging)',
    },
    logoWhite: {
      url: LOGO_WHITE_URL.stg,
    },
    logoBlack: {
      url: LOGO_BLACK_URL.stg,
    },
    proxyAPI: {
      domain: API_URL.stg,
    },
    paymentSite: {
      domain: PAYMENT_SITE.stg,
    },
    profileSite: {
      domain: PROFILE_SITE.stg,
    },
    contentSite: {
      domain: WP_SITE.stg,
    },
    document: {
      s3: DOUCTMENT_S3.stg,
    },
    accountsSite: {
      domain: ACCOUNTS_SITE.stg,
    },
    topSite: {
      domain: TOP_SITE.stg,
    },
    firebase: {
      message_sender_id: FIREBASE_MESSAGE_SENDER_ID.stg,
    },
    debugReduxLogger: debug.reduxLogger.stg,
    register: {
      domain: REGISTER.stg,
    },
    billing: {
      domain: BILLING.stg,
    },
    products: {
      json: PRODUCTS.stg,
    },
    featureSwitch: {
      VL10160: featureSwitch.VL10160.stg,
    },
    INVITING_LIMIT: INVITING_LIMIT.stg,
  },
  production: {
    app: {
      name: 'Buddy FE',
    },
    logoWhite: {
      url: LOGO_WHITE_URL.prod,
    },
    logoBlack: {
      url: LOGO_BLACK_URL.prod,
    },
    proxyAPI: {
      domain: API_URL.prod,
    },
    paymentSite: {
      domain: PAYMENT_SITE.prod,
    },
    profileSite: {
      domain: PROFILE_SITE.prod,
    },
    contentSite: {
      domain: WP_SITE.prod,
    },
    topSite: {
      domain: TOP_SITE.prod,
    },
    document: {
      s3: DOUCTMENT_S3.prod,
    },
    accountsSite: {
      domain: ACCOUNTS_SITE.prod,
    },
    firebase: {
      message_sender_id: FIREBASE_MESSAGE_SENDER_ID.prod,
    },
    debugReduxLogger: debug.reduxLogger.prod,
    register: {
      domain: REGISTER.prod,
    },
    billing: {
      domain: BILLING.prod,
    },
    products: {
      json: PRODUCTS.prod,
    },
    featureSwitch: {
      VL10160: featureSwitch.VL10160.prod,
    },
    INVITING_LIMIT: INVITING_LIMIT.prod,
  },
};

export default setting[env];
