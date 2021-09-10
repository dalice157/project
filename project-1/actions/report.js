import { RSAA } from 'redux-api-middleware';

/**
 * 取得 user 的違規紀錄
 */
export const loadReportRecord = () => {
  return {
    [RSAA]: {
      endpoint: '/api/report/getReportRecord',
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'LOAD_REPORT_RECORD_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * 取得 user 的違規紀錄
 */
export const loadOtherReportRecord = (basicId = '') => {
  return {
    [RSAA]: {
      endpoint: '/api/report/getOtherReportRecord/' + basicId,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'LOAD_OTHER_REPORT_RECORD_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * 取得 [高手] 檢舉 [需求者] 時所需的Demand清單
 * @param {String} demanderId 需求者 id
 */
export const loadReportDemandList = (demanderId) => {
  return {
    [RSAA]: {
      endpoint: '/api/report/getReportList/' + demanderId,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'LOAD_REPORT_DEMAND_LIST_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * 檢舉
 * @param {object} reportBody
 */
export const loadReportHim = (reportBody) => {
  return {
    [RSAA]: {
      endpoint: '/api/report/reportTarget',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportBody: reportBody,
      }),
      types: [
        'REQUEST',
        'REPORT_HIM_SUCCESS',
        'FAILURE',
      ]
    }
  };
};
