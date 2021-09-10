import React from 'react';
import { Provider } from 'react-redux';
import { Router, Switch } from 'react-router-dom';
import DefaultLayout from './routers.js';
import './App.scss';

const App = ({ store, history }) => (
  <Provider store={ store }>
    <Router history={ history }>
      <Switch>
        <DefaultLayout />
      </Switch>
    </Router>
  </Provider>
);
export default App;
