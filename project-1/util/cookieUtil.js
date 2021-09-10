import { tagText } from './commonUtil';
import { SHOW_KEY } from '../config/constant.js';

const inSSR = typeof localStorage == 'undefined';

export function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  if (document) {
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }
}

export function getCookie(name) {
  let nameEQ = name + '=';
  let ca = (typeof document !== 'undefined') ? document.cookie.split(';') : [];
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function eraseCookie(name) {
  if (document) {
    document.cookie = name + '=; Max-Age=-99999999;';
  }
}

class ReactLocalStorage {
  set = (key, value) => {
    localStorage[key] = value;
    return localStorage[key];
  }

  get = (key, defaultValue = undefined, silent = true) => {
    let value = (!inSSR && localStorage[key]) || defaultValue;

    // if silent=false throw error
    if (!silent && !value) {
      throw new Error(key + ' not found in localStorage');
    }

    return value;
  }

  setObject = (key, value) => {
    // console.log('key', key);
    localStorage[key] = JSON.stringify(value);
    return localStorage[key];
  }

  getObject = (key, defaultValue = {}, silent = true) => {
    let value = this.get(key, JSON.stringify(defaultValue), silent);

    try {
      return JSON.parse(value);
    } catch (e) {
      // will raise error for parsing
      if (!silent) {
        throw new Error('Error in parsing value');
      }
    }
  }

  // 最近查詢前5筆
  setRecentQuery = (type, query, areaData) => {
    let params = Object.assign({}, query);
    if ('pageNum' in params) {
      return;
    }

    const inTutorPage = type === 'search-tutor'; // 為了找老師的特別處理
    let list = this.getObject('_recent_' + type, { list: [] }).list;
    // console.log('params', params);
    const display = Object.keys(params).filter(key => SHOW_KEY.includes(key) && params[key] != '-1000000' && (!inTutorPage || params[key] != '1000000')).map(key => tagText(key, params[key], areaData));

    if (display.length != 0) {
      if (list.length >= 5) {
        list.pop();
      }
      if (params.cats == '-1000000' || (inTutorPage && params.cats == '1000000')) {
        delete params.cats;
      }
      list.unshift({ tag: display, param: params });
      // console.log('unshift', list);
      this.setObject('_recent_' + type, {
        list: list
      });
    }
  }

  clear = () => {
    return localStorage.clear();
  }

  remove = (key) => {
    return localStorage.removeItem(key);
  }
}

export const reactLocalStorage = new ReactLocalStorage();
