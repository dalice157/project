import { RSAA } from 'redux-api-middleware';
import config from '../config/config';
const JAVA_URL = config.proxyAPI.domain;

export const getMemo = (basicId, lastKey, memoSource, demandId) => {
console.log('lastKey:', lastKey);
  const isLastKey = lastKey ? `${lastKey}&` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/memo/list/${basicId}?lastKey=${isLastKey}&memoSource=${memoSource}${demandId ? '&demandId=' + demandId : ''}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'LOAD_MEMO_SUCCESS',
        'FAILURE'
      ]
    }
  };
};