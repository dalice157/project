import { RSAA } from 'redux-api-middleware';
import config from '../config/config';

const JAVA_URL = config.proxyAPI.domain;

export const loadTestAccountList = () => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/setting/testAccount`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_TEST_ACCOUNT',
        'LOAD_TEST_ACCOUNT_SUCCESS',
        'FAILURE'
      ]
    }
  };
};

export const addTestAccount = (basicId) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/setting/testAccount?basicId=${basicId}`,
      method: 'PUT',
      credentials: 'include',
      types: [
        'REQUEST_ADD_TEST_ACCOUNT',
        'ADD_TEST_ACCOUNT_SUCCESS',
        'FAILURE'
      ]
    }
  };
};

export const removeTestAccount = (basicId) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/setting/testAccount?basicId=${basicId}`,
      method: 'DELETE',
      credentials: 'include',
      types: [
        'REQUEST_REMOVE_TEST_ACCOUNT',
        'REMOVE_TEST_ACCOUNT_SUCCESS',
        'FAILURE'
      ]
    }
  };
};
export const loadAssignment = () => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/setting/assignment`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'LOAD_ASSIGNMENT_SUCCESS',
        'FAILURE'
      ]
    }
  };
};

export const saveAssignment = (form) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/setting/assignment`,
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      types: [
        'REQUEST',
        'SUCCESS_MSG',
        'FAILURE'
      ]
    }
  };
};

export const email2pid = (email) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/setting/email2pid?email=${email}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'EXCHANGE_EMAIL_SUCCESS',
        'FAILURE'
      ]
    }
  };
};

export const clean = () => ({
  type: 'EXCHANGE_EMAIL_CLEAN'
});
