// history.js
import qs from 'qs';
import { createBrowserHistory as createHistory } from 'history';

function addQuery(history) {
  const location = history.location;
  history.location = { ...location, query: qs.parse(location.search, { ignoreQueryPrefix: true }) };
}

const history = createHistory({ basename: '/admin' });

addQuery(history);

history.add = (key, value, path) => {
  let query = history.location.query;
  if (typeof key === 'string') {
    if (value === 0 || value) {
      query[key] = value;
    } else {
      delete query[key];
    }
  } else {
    query = { ...query, ...key };
  }

  const stringified = qs.stringify(query);
  history.push((path || history.location.pathname) + '?' + stringified);
};

history.remove = (key) => {
  let query = history.location.query;
  delete query[key];
  const stringified = qs.stringify(query);
  history.push(history.location.pathname + '?' + stringified);
};


export const unlisten = history.listen(() => {
  // 每次页面跳转都会执行
  addQuery(history);
});

export default history;
