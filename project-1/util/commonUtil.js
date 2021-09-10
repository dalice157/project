import dayjs from 'dayjs';
import { catSearch } from './categoryUtils';
import { showCat } from './lablesUtils.js';
import {
  targetData, methodData, experienceData, timeSlotData, wayOfClassTypes,
} from '../config/selectData.js';


export function filterXSS(content) {
  return content.replace(/</g, '\\u003c');
}

export function isNumber(num) {
  const regex = /^[\d]*$/;

  return regex.test(num);
}

export function isCellphone(cellphone) {
  const regex = /^[+]?[0-9]{10,15}$/;

  return regex.test(cellphone);
}

export function isGigId(gigId) {
  if (gigId == 'Gig-Other') return true;
  const regex = /^Gig-[\d]*$/;

  return regex.test(gigId);
}

/**
 * 金錢格式
 * @export moneyFormat
 * @param {arr} str
 * @returns
 */
export function moneyFormat(str) {
  if (str.length <= 3) {
    return str;
  }
  return `${moneyFormat(str.substr(0, str.length - 3))},${str.substr(str.length - 3)}`;
}

/**
 * 地區
 * @export showAreaText
 * @param {array} areaData
 * @param {array} keyArr
 * @returns
 */
export function showAreaText(areaData, keyArr) {
  if (!keyArr) {
    return '不分地區';
  }
  const newArr = keyArr.map((key) => {
    const ele = catSearch(areaData, key);
    return ele ? ele.des : '';
  });
  return newArr.join('、');
}

/**
 * 經驗
 * @export showText
 * @param {array} data
 * @param {number} key
 * @returns
 */
export function showText(data, key) {
  const ele = key || key !== -1 ? data.find(item => item.id == key) : '無經驗';
  return ele ? ele.title : '';
}

/**
 * 文字組合(服務方式、服務對象、服務時段)
 * @export showArrayText
 * @param {array} data
 * @param {array} keyArr
 * @returns
 */
export function showArrayText(data, keyArr) {
  if (!keyArr || keyArr.length === 0) {
    return '未指定';
  }

  return data.length === keyArr.length ? '不拘' : keyArr.map(item => showText(data, item)).join('、');
}

/**
 * 標籤組合
 * @export tagText
 * @param {string} key
 * @param {array} value
 * @param {array} areaData
 * @returns
 */

function proirityHandle(value) {
  const opts = value.split(',');
  const optArr = [];
  opts.forEach((key) => {
    let tmp = timeSlotData[0].times.find(item => item.value == key);
    if (tmp) {
      optArr.push(tmp.label);
    } else {
      tmp = timeSlotData[1].times.find(item => item.value == key);
      if (tmp) {
        optArr.push(tmp.label);
      }
    }
  });
  return optArr.join();
}

function classWayHandle(value) {
  const datas = value.split(',');
  const arr = [];
  datas.forEach((key) => {
    const tmp = wayOfClassTypes[key - 1];
    if (tmp) {
      arr.push(tmp.label);
    }
  });
  return arr.join('、');
}

export function tagText(key = 'default', value, areaData) {
  const tags = new Map([
    ['q', `#${value} `],
    ['cats', () => value.split(',').map(no => `${showCat(no)} `)],
    ['areas', () => (areaData.length > 0 && value ? showAreaText(areaData, value.split(',')) : ' ')],
    ['priceMin', `${value} 元以上`],
    ['priceMax', `${value} 元以下`],
    ['expCat', (showText(experienceData, value))],
    ['clientCats', (showText(targetData, value))],
    ['onsiteOpts', (showText(methodData, value))],
    ['proirityOpts', () => proirityHandle(value)],
    ['classWay', () => classWayHandle(value)],
    ['isOnlyMedal', '金牌高手、銀牌高手'],
    ['default', 'NO text'],
  ]);
  const tagSelection = tags.get(key) || tags.get('default');
  return typeof (tagSelection) === 'function' ? tagSelection.call(this) : tagSelection;
}

export function pastSixMonthsFormat() {
  let i = 0;
  const dateArr = [];
  for (i; i < 6 && i >= 0; i++) {
    dateArr.push(dayjs().add(-i, 'month').format('YYYY-MM'));
  }
  return dateArr;
}


// 對齊 AC EMAIL 檢核
export const REGEX_EMAIL = /^[A-Za-z0-9_.-]+(\.[A-Za-z0-9_.-]+)*@[A-Za-z0-9_.-]+(\.[A-Za-z0-9_.-]+)*(\.[A-Za-z]{2,})$/;

// 去除demandId前幾個字
export const demandNo = demandId => demandId.slice(7);

export function sleep(ms) {
  console.log(`sleep ${ms}ms`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 判斷超過*.5-*.9星星都可以讀到半顆
export const rateAllowHalf = (val) => {
  let rateVal = Number(val);
  if (rateVal < Math.ceil(rateVal)) {
    return rateVal = Math.floor(rateVal) + 0.5;
  }
  return rateVal;
};
