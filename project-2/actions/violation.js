import { RSAA } from 'redux-api-middleware';
import config from '../config/config';

const JAVA_URL = config.proxyAPI.domain;

export const queryViolationTodo = () => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/violation/list/todo`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'LOAD_VIOLATION_LIST_SUCCESS',
        'FAILURE'
      ]
    }
  };
};

export const queryViolationListByKey = (type, key) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/violation/list/${key}?type=${type}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'LOAD_VIOLATION_LIST_SUCCESS',
        'FAILURE'
      ]
    }
  };
};
//    targetType: 0,causeType: 0,handleStatus: 0,
export const queryViolationList = (formValue) => {
  const {
    year, month, targetType, causeType, handleStatus
  } = formValue;
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/violation/list?year=${year}&month=${month}&targetType=${targetType}&causeType=${causeType}&handleStatus=${handleStatus}`,
      credentials: 'include',
      method: 'GET',
      types: [
        'REQUEST',
        'LOAD_VIOLATION_LIST_SUCCESS',
        'FAILURE'
      ]
    }
  };
};
export const queryViolation = (yyyyMM, recordId) => {
  // console.log('yyyyMM', yyyyMM);
  // console.log('recordId', recordId);
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/violation/getViolation?recordId=${recordId}&yyyyMM=${yyyyMM}`,
      credentials: 'include',
      method: 'GET',
      types: [
        'REQUEST',
        'LOAD_VIOLATION_SUCCESS',
        'FAILURE'
      ]
    }
  };
};

export const memoFormSubmit = (form) => {
  const { yyyyMM, recordId } = form;
  console.log('yyyyMM', yyyyMM);
  console.log('recordId', recordId);
  console.log('form', form);
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/violation/handleViolation?yyyyMM=${yyyyMM}&recordId=${recordId}`,
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      types: [
        'REQUEST',
        'UPDATE_VIOLATION_MEMO_SUCCESS',
        'FAILURE'
      ]
    }
  };
};
