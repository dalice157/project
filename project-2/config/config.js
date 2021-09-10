import productLab from './Products-develop.json';
import productStg from './Products-staging.json';
import productProd from './Products-production.json';
import purchaseProductsLab from './PurchaseProducts-develop.json';
import purchaseProductsStg from './PurchaseProducts-staging.json';
import purchaseProductsProd from './PurchaseProducts-production.json';

const env = process.env.REACT_APP_NODE_ENV_CLIENT || 'development';

console.log('env = ', env);

const API_URL = {
  local: '',
  lab: '',
  stg: '',
  prod: '',
  test: '',
};

const INITIAT_LOGIN_URL = {
  test: 'http://top.localhost:3000/api/CRM-initiating-login',
  lab: 'https://top.104-dev.com.tw/api/CRM-initiating-login',
  stg: 'https://top.104-staging.com.tw/api/CRM-initiating-login',
  prod: 'https://top.104.com.tw/api/CRM-initiating-login',
};

const AREA_CAT_URL = {
  lab: 'https://static.104-dev.com.tw/category-tool/json/Area.json',
  stg: 'https://static.104-staging.com.tw/category-tool/json/Area.json',
  prod: 'https://static.104.com.tw/category-tool/json/Area.json',
};

const INDUSTRY_CAT_URL = {
  lab: 'https://static.104-dev.com.tw/category-tool/json/Indust.json',
  stg: 'https://static.104-staging.com.tw/category-tool/json/Indust.json',
  prod: 'https://static.104.com.tw/category-tool/json/Indust.json',
};

const PAYMENT_SITE = {
  lab: 'https://pro.104-dev.com.tw',
  stg: 'https://pro.104-staging.com.tw',
  prod: 'https://pro.104.com.tw',
};

const AC_MANAGER_URL = {
  lab: 'https://ac-manager.104-dev.com.tw',
  stg: 'https://ac-manager.104-staging.com.tw',
  prod: 'https://ac-manager.104.com.tw',
};

const DOUCTMENT_S3 = {
  lab: 'https://ori.doc.104-dev.com.tw',
  stg: 'https://ori.doc.104-staging.com.tw',
  prod: 'https://ori.doc.104.com.tw',
};

const PRODUCTS_JSON = {
  lab: productLab,
  stg: productStg,
  prod: productProd,
};

const TOP_SITE = {
  lab: 'https://top.104-dev.com.tw',
  stg: 'https://top.104-staging.com.tw',
  prod: 'https://top.104.com.tw',
};

/**
 * 功能開關：全為 true 時，盤點相關程式碼並移除後，就沒有存在的必要了
 * - VL9201Switch
 */
const featureSwitch = {
  VL9231Switch: {
    local: true,
    lab: false,
    stg: false,
    prod: false,
  },
  VL10168: {
    local: true,
    lab: true,
    stg: true,
    prod: false,
  },
};

const setting = {
  development: {
    app: {
      name: 'Buddy FE (local)',
    },
    proxyAPI: {
      domain: API_URL.test,
      proxyLogin: INITIAT_LOGIN_URL.test,
    },
    paymentSite: {
      domain: PAYMENT_SITE.lab,
    },
    static: {
      area_url: AREA_CAT_URL.lab,
      industry_url: INDUSTRY_CAT_URL.lab,
    },
    document: {
      s3: DOUCTMENT_S3.lab,
    },
    acManagerUrl: AC_MANAGER_URL.lab,
    products: {
      data: PRODUCTS_JSON.lab,
    },
    devToolsSwitch: true,
    topSite: {
      domain: TOP_SITE.lab,
    },
    VL9231Switch: featureSwitch.VL9231Switch.local,
    VL10168Switch: featureSwitch.VL10168.local,
    purchaseProducts: purchaseProductsLab,
  },
  develop: {
    app: {
      name: 'Buddy FE (develop)',
    },
    proxyAPI: {
      domain: API_URL.lab,
      proxyLogin: INITIAT_LOGIN_URL.lab,
    },
    paymentSite: {
      domain: PAYMENT_SITE.lab,
    },
    static: {
      area_url: AREA_CAT_URL.lab,
      industry_url: INDUSTRY_CAT_URL.lab,
    },
    document: {
      s3: DOUCTMENT_S3.lab,
    },
    acManagerUrl: AC_MANAGER_URL.lab,
    products: {
      data: PRODUCTS_JSON.lab,
    },
    devToolsSwitch: true,
    topSite: {
      domain: TOP_SITE.lab,
    },
    VL9231Switch: featureSwitch.VL9231Switch.lab,
    VL10168Switch: featureSwitch.VL10168.lab,
    purchaseProducts: purchaseProductsLab,
  },
  staging: {
    app: {
      name: 'Buddy FE (staging)',
    },
    proxyAPI: {
      domain: API_URL.stg,
      proxyLogin: INITIAT_LOGIN_URL.stg,
    },
    paymentSite: {
      domain: PAYMENT_SITE.stg,
    },
    static: {
      area_url: AREA_CAT_URL.stg,
      industry_url: INDUSTRY_CAT_URL.stg,
    },
    document: {
      s3: DOUCTMENT_S3.stg,
    },
    acManagerUrl: AC_MANAGER_URL.stg,
    products: {
      data: PRODUCTS_JSON.stg,
    },
    devToolsSwitch: true,
    topSite: {
      domain: TOP_SITE.stg,
    },
    VL9231Switch: featureSwitch.VL9231Switch.stg,
    VL10168Switch: featureSwitch.VL10168.stg,
    purchaseProducts: purchaseProductsStg,
  },
  production: {
    app: {
      name: 'Buddy FE',
    },
    proxyAPI: {
      domain: API_URL.prod,
      proxyLogin: INITIAT_LOGIN_URL.prod,
    },
    paymentSite: {
      domain: PAYMENT_SITE.prod,
    },
    static: {
      area_url: AREA_CAT_URL.prod,
      industry_url: INDUSTRY_CAT_URL.prod,
    },
    document: {
      s3: DOUCTMENT_S3.prod,
    },
    acManagerUrl: AC_MANAGER_URL.prod,
    products: {
      data: PRODUCTS_JSON.prod,
    },
    devToolsSwitch: false,
    topSite: {
      domain: TOP_SITE.prod,
    },
    VL9231Switch: featureSwitch.VL9231Switch.prod,
    VL10168Switch: featureSwitch.VL10168.prod,
    purchaseProducts: purchaseProductsProd,
  },
};

export default setting[env];
