import React from 'react';
import { hydrate, render } from 'react-dom';
import '@babel/polyfill';
import 'unfetch/polyfill';
import history from './config/history.js';
import * as Joi from 'joi-i18n';
import * as serviceWorker from './serviceWorker';
// import * as chatmetaUtil from './util/chatmetaUtil';

import configureStore from './config/configureStore.js';

import language from './config/joi-zh_TW_language.js';

import App from './App';

const env = process.env.REACT_APP_NODE_ENV_CLIENT || 'development';
var hasLoggedOnce = false;

// var accessManager = null;

function setup() {
  const initState = window.__INITIAL_STATE__;
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
  
  const store = configureStore(initState);

  Joi.addLocaleData('zh_TW', language);

  const disableDebugLog = env == 'production';
  // const disableDebugLog = true;
  if (disableDebugLog) {
    if (!window.console) window.console = {};
    let methods = ['log', 'debug', 'warn', 'info'];
    for (let i = 0; i < methods.length; i++) {
      // eslint-disable-next-line func-names
      console[methods[i]] = function () {};
    }
  }

  //report all user console errors to API proxy
  if(env != 'development') {
    Error.stackTraceLimit = 10;
    window.onerror = function(message, src, lineNumber, colno, error) {
      if (hasLoggedOnce || !message) {
        // It does not make sense to report an error if:
        // 1. another one has already been reported -- the page has an invalid state and may produce way too many errors.
        // 2. the provided information does not make sense (!eventOrMessage -- the browser didn't supply information for some reason.)
        return;
      }
      hasLoggedOnce = true;
      const stackMsg = "[stack] - " + error.stack;
      // console.log('colno', colno);
      // console.log('error', error);
      fetch('/api/errorLogging', {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({
          message: message,
          url: window.location.href,
          stackMsg: stackMsg
        }), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
          }
      }).then(() => {
        setTimeout(function () {
          hasLoggedOnce = false;
        },3000);
      });
      return true;
    }
  }
	

  return (
    <App store={store} history={history} />
  );
}

// ReactDOM.render(setup(), document.getElementById('root'));
const rootElement = document.getElementById('root');
// setup().then(app => {
if (rootElement.hasChildNodes()) {
  hydrate(setup(), rootElement);
} else {
  render(setup(), rootElement);
}
// });


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
