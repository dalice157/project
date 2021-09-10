import { RSAA } from 'redux-api-middleware';
import config from '../config/config';

const JAVA_URL = config.proxyAPI.domain;
const AREA_URL = config.static.area_url;
const INDUSTRY_URL = config.static.industry_url;

export const login = form => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs-login`,
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
    types: [
      'REQUEST',
      'LOGIN_SUCCESS',
      'FAILURE',
    ],
  },
});

export const loginCheck = () => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs-check`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOGIN_SUCCESS',
      'NOTHING',
    ],
  },
});

export const loadStaticArea = () => ({
  [RSAA]: {
    endpoint: `${AREA_URL}`,
    method: 'GET',
    types: [
      'REQUEST',
      'LOAD_STATIC_AREA_SUCCESS',
      'LOAD_STATIC_AREA_ISSUES',
    ],
  },
});

export const loadStaticIndustry = () => ({
  [RSAA]: {
    endpoint: `${INDUSTRY_URL}`,
    method: 'GET',
    types: [
      'REQUEST',
      'LOAD_STATIC_INDUSTRY_SUCCESS',
      'LOAD_STATIC_INDUSTRY_ISSUES',
    ],
  },
});

export const sendVerifySMS = (basicId, cellphone) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/sendSMS/${basicId}`,
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: cellphone,
    types: [
      'REQUEST',
      'SEND_VERIFY_SMS_SUCCESS',
      'FAILURE',
    ],
  },
});
