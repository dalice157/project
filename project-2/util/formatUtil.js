import React from 'react';
import dayjs from 'dayjs';
import config from '../config/config';
import { catSearch } from './categoryUtils';
import { SOURSE_TYPE_TABLE } from '../config/constant';

const BASE_URL = config.app.name;

// 金額到第三位會多逗號
export const numberWithCommas = x => (x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0);
export const isSex = sex => (sex === 0 ? '先生' : '小姐');

export const isSexImg = sex => (sex === 0 ? `${BASE_URL}/img/img_b_80x80.gif` : `${BASE_URL}/img/img_g_80x80.gif`);

export const dateFormat = (ms, includeTime = false) => {
  if (ms === null || ms === undefined) { return ''; }
  const getDate = new Date(ms);
  return includeTime ? getDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) : `${getDate.getFullYear()}/${(`0${getDate.getMonth() + 1}`).slice(-2)}/${(`0${getDate.getDate()}`).slice(-2)}`;
};


export const chDateFormat = (ms) => {
  if (ms === null || ms === undefined) { return '-'; }
  const getDate = new Date(ms);
  return `${getDate.getFullYear() - 1911} 年 ${(`0${getDate.getMonth() + 1}`).slice(-2)} 月 ${(`0${getDate.getDate()}`).slice(-2)} 日 `;
};

export const dailyOrCurrentFormat = (val, format) => {
  if (val === 'current') {
    return dayjs().format(format);
  }
  return dayjs(val).format(format);
};
export const startDateFormat = val => dayjs(val).startOf('month').format('YYYY/MM/DD');
export const endDateFormat = val => dayjs(val).endOf('month').format('YYYY/MM/DD');

export const optionsToTable = options => options.reduce((result, target) => {
  result[target.value] = target.label;
  return result;
}, {});

export const convertRate = (num, isValidate, point) => {
  const nomOfPercent = 100;
  const offset = point ? 10 ** point : 1;
  const rate = Math.round(num * offset * nomOfPercent) / offset;
  return <span style={(isValidate && rate < nomOfPercent) ? { color: 'red', fontWeight: 'bold' } : null}>{`${rate.toFixed(point)}%`}</span>;
};

export const convertFloat = num => `${Math.round(num)}`;

const convertToAreaTitle = (areaNo, areaTable) => {
  const areaObject = catSearch(areaTable, areaNo.slice(9, 19));
  return areaObject ? areaObject.des : '';
};

export function replaceAreaNo(content, areaTable) {
  if (areaTable && areaTable.length === 0) {
    return content;
  }
  // $postNum(xxxxxxxxx) => 新北市新店區
  const areaNoExpression = /\$postNum\(\d{10}\)/g;
  const replacedContent = content.replaceAll(areaNoExpression, areaNo => convertToAreaTitle(areaNo, areaTable));
  return replacedContent;
}

export const daysToWeeks = (days) => {
  const weekDays = [];
  for (let i = 0; i < days.length; i += 7) {
    const firstOfWeek = Object.assign({}, days[i]);
    for (let j = 1; j < 7; j++) {
      const isNotExist = !(typeof (days[i + j]) === 'object');
      if (isNotExist) {
        break;
      }
      Object.assign(firstOfWeek, { value: firstOfWeek.value + days[i + j].value });
    }
    weekDays.push(firstOfWeek);
  }
  return weekDays;
};

export const filterDaysToWeeks = (dateFilterType, sourceType, data) => {
  if (dateFilterType === 1) {
    return data;
  }
  const keyList = SOURSE_TYPE_TABLE[sourceType];
  const classifiedList = keyList.map(key => data.filter(dayData => dayData.key === key));
  const weekDays = classifiedList.reduce((acc, classifiedData) => [...acc, ...daysToWeeks(classifiedData)], []);
  return weekDays;
};
