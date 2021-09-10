// Redux modure , router 及 redux 的橋接
import { createStore, applyMiddleware } from 'redux';
// Reducers

// functional middleware
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import rootReducer from '../reducers';

import config from './config';

const configureStore = (preloadedState) => {
  const store = config.devToolsSwitch ? createStore(rootReducer, preloadedState, applyMiddleware(thunk, apiMiddleware, logger))
    : createStore(rootReducer, preloadedState, applyMiddleware(thunk, apiMiddleware));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
