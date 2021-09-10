import { RSAA } from 'redux-api-middleware';
import config from '../config/config';

const JAVA_URL = config.proxyAPI.domain;

export const loadPlanStatisticsTable = (targetStartDate, targetEndDate, comparedStartDate, comparedEndDate) => {
  const comparedStartDateQuery = comparedStartDate ? `&compareStartDate=${encodeURIComponent(comparedStartDate)}` : '';
  const comparedEndDateQuery = comparedEndDate ? `&compareEndDate=${encodeURIComponent(comparedEndDate)}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/statistics/plans?targetStartDate=${encodeURIComponent(targetStartDate)}&targetEndDate=${encodeURIComponent(targetEndDate)}${comparedStartDateQuery}${comparedEndDateQuery}`,
      method: 'GET',
      types: [
        'REQUEST_PLANS_STATISTICS',
        'LOAD_PLANS_STATISTICS_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const loadSalesStatistics = (targetMonth, compareMonth) => {
  const compareMonthQuery = compareMonth ? `&compareMonth=${encodeURIComponent(compareMonth)}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/statistics/sales?targetMonth=${encodeURIComponent(targetMonth)}${compareMonthQuery}`,
      method: 'GET',
      types: [
        'REQUEST_SALES_STATISTICS',
        'LOAD_SALES_STATISTICS_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const loadMarketingPlanStatisticsTable = (targetStartDate, targetEndDate, comparedStartDate, comparedEndDate) => {
  const comparedStartDateQuery = comparedStartDate ? `&compareStartDate=${encodeURIComponent(comparedStartDate)}` : '';
  const comparedEndDateQuery = comparedEndDate ? `&compareEndDate=${encodeURIComponent(comparedEndDate)}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/statistics/marketing/plans?targetStartDate=${encodeURIComponent(targetStartDate)}&targetEndDate=${encodeURIComponent(targetEndDate)}${comparedStartDateQuery}${comparedEndDateQuery}`,
      method: 'GET',
      types: [
        'REQUEST_STATISTICS',
        'LOAD_PLANS_STATISTICS_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const loadMarketingSalesStatistics = ({ targetMonth, compareMonth }, isCompared) => {
  const targetMonthQuery = `?targetMonth=${encodeURIComponent(targetMonth)}`;
  const compareMonthQuery = isCompared ? `&compareMonth=${encodeURIComponent(compareMonth)}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/statistics/marketing/sales${targetMonthQuery}${compareMonthQuery}`,
      method: 'GET',
      types: [
        'REQUEST_SALES_STATISTICS',
        'LOAD_SALES_STATISTICS_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const loadMarketingSalesDailyStatistics = ({
  targetStartDate, targetEndDate, comparedStartDate, comparedEndDate,
}, isCompared) => {
  const targetDateQuery = `?targetEndDate=${encodeURIComponent(targetEndDate)}&targetStartDate=${encodeURIComponent(targetStartDate)}`;
  const comparedDateQuery = isCompared ? `&compareEndDate=${encodeURIComponent(comparedEndDate)}&compareStartDate=${encodeURIComponent(comparedStartDate)}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/statistics/marketing/sales/daily${targetDateQuery}${comparedDateQuery}`,
      method: 'GET',
      types: [
        'REQUEST_SALES_DAILY_STATISTICS',
        'LOAD_SALES_DAILY_STATISTICS_SUCCESS',
        'FAILURE_SALES_DAILY_STATISTICS',
      ],
    },
  };
};

export const loadCategoryPool = (form) => {
  const {
    dimensionType, segmentType, sourceType, startDate, endDate, targetType,
  } = form;
  console.log('start query:', form);
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/statistics/categoryPool?targetStartDate=${encodeURIComponent(startDate)}&targetEndDate=${encodeURIComponent(endDate)}&dimensionType=${dimensionType}&segmentType=${segmentType}&sourceType=${sourceType}&targetType=${targetType}`,
      method: 'GET',
      types: [
        'REQUEST_CATEGORY_POOL',
        'LOAD_CATEGORY_POOL_SUCCESS',
        'FAILURE',
      ],
    },
  };
};
