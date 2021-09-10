import React from 'react';
import { Provider } from 'react-redux';
import { Router, Switch } from 'react-router-dom';
import DefaultLayout from './layouts/defaultLayout';
import NoHeaderLayout from './layouts/NoHeaderLayout';

const App = ({ store, history }) => (
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        {history.location.query.stickerMode ? <NoHeaderLayout /> : <DefaultLayout />/* {renderRoutes(Routes)} */}
      </Switch>
    </Router>
  </Provider>
);
export default App;
