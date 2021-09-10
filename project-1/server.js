import nodeFetch from 'node-fetch';
import fs from 'fs';
import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
// import { deviceDetect } from 'react-device-detect';
// const MobileDetect = require('mobile-detect');
import { matchRoutes } from 'react-router-config';
import { StaticRouter, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';
import configureStore from './config/configureStore.js';
import DefaultLayout from './layouts/defaultLayout';
import NoHeaderLayout from './layouts/NoHeaderLayout';
import Routes from './Routes';
import ignoreRoutePath from './config/ignoreRoutePath';

const compression = require('compression');
const express = require('express');
const path = require('path');
const http = require('request');
const proxy = require('http-proxy-middleware');
const httpContext = require('express-http-context');

const env = process.env.FE_ENV || 'develop';
process.env.TZ = 'Asia/Taipei';

const PORT = 3000;

const BS_ENTRACE_POINT = {
  develop: 'https://s3-ap-northeast-1.amazonaws.com/admin.top.104-dev.com.tw/index.html',
  staging: 'https://s3-ap-northeast-1.amazonaws.com/admin.top.104-staging.com.tw/index.html',
  production: 'https://s3-ap-northeast-1.amazonaws.com/admin.top.104.com.tw/index.html'
};

// initialize the application and create the routes
const app = express();
app.use(compression());
app.use(httpContext.middleware);

const context = {};
const fetch = (url, opts = {}) => (url.startsWith('http') ? nodeFetch(url, { ...opts }) : nodeFetch(`http://localhost:3001${url}`, { ...opts }));
globalThis.fetch = fetch;


app.get('/admin/*', (req, res) => {
  http(BS_ENTRACE_POINT[env]).pipe(res);
});

const MARKETING_ENDPOINT = {
  develop: 'http://freebird-application-web-freebirdmarketingbucket-16e3mtsr2lwiy.s3-website-ap-northeast-1.amazonaws.com',
  staging: 'http://freebird-application-web-freebirdmarketingbucket-gb43yyfs5bl3.s3-website-ap-northeast-1.amazonaws.com',
  production: 'http://freebird-application-web-freebirdmarketingbucket-xow7jjhvw5fx.s3-website-ap-northeast-1.amazonaws.com',
};

app.get('/edm/*', (req, res) => {
  const url = MARKETING_ENDPOINT[env] + req.url;
  const options = {
    url: url,
    headers: {
      'Cache-Control': 'no-cache,no-store',
      Pragma: 'no-cache',
      Expires: '0'
    }
  };
  http(options).pipe(res);
});

app.get('/event/*', (req, res) => {
  const url = MARKETING_ENDPOINT[env] + req.url;
  const options = {
    url: url,
    headers: {
      'Cache-Control': 'no-cache,no-store',
      Pragma: 'no-cache',
      Expires: '0'
    }
  };
  http(options).pipe(res);
});

if (env == 'develop') {
  app.use(proxy('/api', { target: 'http://localhost:3001/' }));
}


app.use(express.static(
  path.resolve(__dirname, '..', 'build'),
  { maxAge: '30d', index: false },
));

// const BILLING_COMPONENT = {
//   develop: 'https://billing.104-dev.com.tw/js/app.js',
//   staging: 'https://billing.104-staging.com.tw/js/app.js',
//   production: 'https://billing.104.com.tw/js/app.js',
// };

app.get('/*', (req, res) => {
  // const { isMobile } = deviceDetect(req.headers['user-agent']);
  // console.log('isMobile', isMobile);

  // 給react-device-detect用的
  httpContext.set('userAgent', req.headers['user-agent']);

  // 1
  // console.log('URL:', req.originalUrl);

  let store = configureStore({});
  const stickerMode = req.query.stickerMode;
  const queryString = Object.keys(req.query).map(key => key + '=' + req.query[key]).join('&');
  const location = { query: req.query, pathname: req.path, search: queryString };
  // 2
  const promises = matchRoutes(Routes, req.path).map(({ route, match }) => {
    return route.getInitialData ? route.getInitialData(store, match, location) : Promise.resolve(null);
  });

  const ignoreRendering = ignoreRoutePath.find(ignorePath => ignorePath === req.path);
  Promise.all(promises).then(() => {
    // 3
    const rootString = !ignoreRendering ? renderToString(
      <Provider store={store}>
        <StaticRouter location={location} context={context}>
          <Switch>
            {stickerMode ? <NoHeaderLayout /> : <DefaultLayout />}
          </Switch>
        </StaticRouter>
      </Provider>
    ) : '';

    fs.readFile('./build/index.html', 'utf8', (err, data) => {
      if (err) throw err;
      const initState = store.getState();
      const helmet = Helmet.renderStatic();
      const html = injectHTML(data, {
        html: helmet.htmlAttributes.toString(),
        title: helmet.title.toString(),
        meta: helmet.meta.toString(),
        script: helmet.script.toString(),
        body: rootString,
        initState: initState,
        // billingComponent: BILLING_COMPONENT[env],
      });
      // Inserts the rendered React HTML into our main div
      // const document = data.replace(/<div id="root"><\/div>/, `<div id="root">${rootString}</div>`);

      // Sends the response back to the client
      // res.status(200).send(document);
      res.status(200).send(html);
    });
  }).catch(err => console.error(err));
});

const injectHTML = (data, {
  html, title, meta, script, body, initState, // billingComponent
}) => {
  const initialState = JSON.stringify(initState).replace(/</g, '\\u003c');
  meta = decodeEntity(meta);
  data = data.replace('<html>', `<html ${html}>`);
  data = data.replace(/<title>.*?<\/title>/g, title);
  data = data.replace('</head>', `${meta}</head>`);
  // data = data.replace('%BILLING_COMPONENT%', billingComponent);
  data = data.replace('<body>', `<body> \n ${script}<script>window.__INITIAL_STATE__ =${initialState}</script>`);
  data = data.replace(
    '<div id="root"></div>',
    `<div id="root">${body}</div>`
  );

  return data;
};

function decodeEntity(htmlTags) {
  return htmlTags.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}


// SSR
// app.use(ssr);

// HTTP server
const server = app.listen(PORT, () => {
  console.log(`SSR Server (freebrid Started at ${PORT}...`);
});

export default server;
