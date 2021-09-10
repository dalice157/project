import { RSAA } from 'redux-api-middleware';

// 取得訂閱狀態，不合身份該項訂閱回傳null
export const loadSubscribeV2 = () => {
  return {
    [RSAA]: {
      endpoint: '/api/subscribe/get/v2',
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'LOAD_SUBSCRIBE_SUCCESS',
        'FAILURE'
      ]
    }
  };
};

/**
 * 更新個人訂閱狀態
 * @param {*} subscribeDAO
 */
export const updateSubscribeV2 = (subscribeDAO) => {
  return {
    [RSAA]: {
      endpoint: '/api/subscribe/update/v2',
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscribeDAO: subscribeDAO
      }),
      types: [
        'REQUEST',
        'UPDATE_SUBSCRIBE_SUCCESS',
        'FAILURE',
      ]
    }
  };
};
