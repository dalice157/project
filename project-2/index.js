import React from 'react';
import ReactDOM from 'react-dom';
import history from './config/history.js';
import * as Joi from 'joi-i18n';
import configureStore from './config/configureStore.js';
import language from './config/joi-zh_TW_language.js';
import App from './App';
import * as serviceWorker from './serviceWorker';

function setup() {
  const initState = window.__INITIAL_STATE__;
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

  const store = configureStore(initState);

  Joi.addLocaleData('zh_TW', language);

  return (
    <App store={store} history={history} />
  );
}

ReactDOM.render(setup(), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
