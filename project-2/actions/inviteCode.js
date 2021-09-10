import { RSAA } from 'redux-api-middleware';
import config from '../config/config';

const JAVA_URL = config.proxyAPI.domain;

export const queryInviteCode = (formValue) => {
  const { yearMonth } = formValue;
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/inviteCode/list/${yearMonth}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'LOAD_INVITE_CODE_SUCCESS',
        'FAILURE'
      ]
    }
  };
};

export const getInviteCode = (code) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/inviteCode/code/${code}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'GET_INVITE_CODE_SUCCESS',
        'FAILURE'
      ]
    }
  };
};

export const createInviteCode = (form) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/inviteCode/create`,
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      types: [
        'REQUEST',
        'CREATE_INVITE_CODE_SUCCESS',
        'FAILURE'
      ]
    }
  };
};
