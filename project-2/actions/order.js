import { RSAA } from 'redux-api-middleware';
import config from '../config/config';

const JAVA_URL = config.proxyAPI.domain;

export const getMultiPaymentList = (multiSearchList, lastKey) => { // 付費訂單管理-多條件查詢
  const lastKeyQuery = lastKey ? `&lastKey=${lastKey}` : '';
  const {
    dateType, orderStatus, paymentStatus, paymentType, times, purchaseProduct,
  } = multiSearchList;
  const isShowDate = times.start !== '' && times.end !== '' ? `&start=${times.start}&end=${times.end}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/payment/v2/multiSearch?dateType=${dateType}&yearMonth=${times.yearMonth}&paymentType=${paymentType}&paymentStatus=${paymentStatus}&orderStatus=${orderStatus}&purchaseProduct=${purchaseProduct}${isShowDate}${lastKeyQuery}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_ORDER_MULTI_SEARCH',
        'ORDER_MULTI_SEARCH_SUCCESS',
        'FAILURE_ORDER_MULTI_SEARCH',
      ],
    },
  };
};

export const getSinglePaymentList = (keyType, key, lastKey) => { // 付費訂單管理-單一條件查詢
  const lastKeyQuery = lastKey ? `?lastKey=${lastKey}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/payment/v2/list/${keyType}/${encodeURIComponent(key)}${lastKeyQuery}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_ORDER_SINGLE_SEARCH',
        'ORDER_SINGLE_SEARCH_SUCCESS',
        'FAILURE_ORDER_SINGLE_SEARCH',
      ],
    },
  };
};

export const sendRefund = (orderId, refundDate, refundPrice) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/payment/refund/${orderId}?refundDate=${refundDate}&refundPrice=${refundPrice}`,
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    types: [
      'REQUEST_SEND_REFUND',
      'SEND_REFUND_SUCCESS',
      'FAILURE_SEND_REFUND',
    ],
  },
});

export const queryOrder = (formValue, next) => {
  const {
    year, month, status, targetSource, payState,
  } = formValue;
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/deposit/list?year=${year}&month=${month}&status=${status}&targetType=${targetSource}&payState=${payState}${next ? `&cursor=${next}` : ''}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'LOAD_ORDER_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const queryOrderByKey = (type, key) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/deposit/list/${type}/${key}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_ORDER_SUCCESS',
      'FAILURE',
    ],
  },
});

export const queryOrderTodo = next => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/deposit/list/todo${next ? `?cursor=${next}` : ''}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_ORDER_SUCCESS',
      'FAILURE',
    ],
  },
});

export const putOrderRefound = form => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/deposit/refound`,
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
    types: [
      'REQUEST',
      'UPDATE_ORDER_SUCCESS',
      'FAILURE',
    ],
  },
});

export const putBeRevenue = (yyyyMM, id) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/deposit/beRevenue/${yyyyMM}/${id}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST',
      'UPDATE_ORDER_SUCCESS',
      'FAILURE',
    ],
  },
});


// 個人訂單記錄-押金訂單記錄
export const loadDepositList = (basicId, lastKey) => {
  const lastKeyQuery = lastKey ? `?lastKey=${lastKey}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/deposit/list/personal/${basicId}${lastKeyQuery}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_DEPOSIT_LIST',
        'LOAD_DEPOSIT_LIST_SUCCESS',
        'FAILURE_DEPOSIT_LIST',
      ],
    },
  };
};

// 個人訂單記錄-付費訂單記錄
export const loadPaymentList = (basicId, lastKey) => {
  const lastKeyQuery = lastKey ? `?lastKey=${lastKey}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/payment/v2/list/personal/${basicId}${lastKeyQuery}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_PAYMENT_LIST',
        'LOAD_PAYMENT_LIST_SUCCESS',
        'FAILURE_PAYMENT_LIST',
      ],
    },
  };
};
