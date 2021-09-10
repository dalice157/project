import { RSAA } from 'redux-api-middleware';
import config from '../config/config';

const JAVA_URL = config.proxyAPI.domain;

export const getDemandMultiSearch = (
  multiSearchList,
  nextKey,
  hasAppendList
) => {
  // 分頁 不傳過去: 1~50, 傳過去: 下50筆資料
  const cursor = nextKey;

  // 日期條件 createDate onlineDate offDate
  const dateType = multiSearchList.dateType;

  // 月份 2019-06
  const yearMonth = multiSearchList.times.yearMonth;

  // 案件類別 1000000
  const demandType = multiSearchList.demandOptions.demandType === '全部'
    ? 0
    : multiSearchList.demandOptions.demandType;

  // 刊登狀態 0, 1, 2, 3, 4, 5 ...
  const onlineStatus = multiSearchList.onlineStatus;

  // 押金狀態 0, 1, 2, 3, 4, 5, 6, 7 ...
  const depositStatus = multiSearchList.depositStatus;

  // 檢舉狀態 0, 1, 2 ...
  const violationStatus = multiSearchList.violationStatus;

  // 日期 （非必要）
  let start = multiSearchList.times.start === null
    ? null
    : multiSearchList.times.start;
  let end = multiSearchList.times.end === null
    ? null
    : multiSearchList.times.end;

  // parameter setting
  let queryList = `dateType=${dateType}`
    .concat(`&yearMonth=${yearMonth}`)
    .concat(`&demandType=${demandType}`)
    .concat(`&onlineStatus=${onlineStatus}`)
    .concat(`&depositStatus=${depositStatus}`)
    .concat(`&violationStatus=${violationStatus}`)
    .concat(cursor ? `&cursor=${cursor}` : '');

  // 日期 （非必要）
  if (
    start !== ''
    && end !== ''
    && start !== undefined
    && end !== undefined
    && start !== null
    && end !== null
  ) {
    queryList = start === '' || end === ''
      ? queryList
      : queryList.concat(`&start=${start}&end=${end}`);
  }

  if (hasAppendList) {
    // 疊加分頁
    return {
      [RSAA]: {
        endpoint: `${JAVA_URL}/bs/demand/multiSearch?&${queryList}`,
        method: 'GET',
        credentials: 'include',
        types: [
          'REQUEST_APPEND_DEMAND_MULTIPLE_SEARCH',
          'LOAD_APPEND_DEMAND_MULTIPLE_SEARCH_SUCCESS',
          'LOAD_DEMAND_MULTIPLE_SEARCH_ISSUES',
        ],
      },
    };
  } else {
    // 一般多條件查詢
    return {
      [RSAA]: {
        endpoint: `${JAVA_URL}/bs/demand/multiSearch?&${queryList}`,
        method: 'GET',
        credentials: 'include',
        types: [
          'REQUEST_DEMAND_MULTIPLE_SEARCH',
          'LOAD_DEMAND_MULTIPLE_SEARCH_SUCCESS',
          'LOAD_DEMAND_MULTIPLE_SEARCH_ISSUES',
        ],
      },
    };
  }
};

export const getDemandWindow = (demandIdList) => {
  const demandId1 = 'Demand-'.concat(demandIdList.demandId1.trim());
  const demandId2 = 'Demand-'.concat(demandIdList.demandId2.trim());
  const demandId3 = 'Demand-'.concat(demandIdList.demandId3.trim());
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/demandShopWindow/getByDemandId?demandId1=${demandId1}&demandId2=${demandId2}&demandId3=${demandId3}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_LOAD_DEMAND_WINDOW',
        'LOAD_DEMAND_WINDOW_SUCCESS',
        'LOAD_DEMAND_WINDOW_ISSUES',
      ],
    },
  };
};

export const saveDemandWindow = (demandDataList) => {
  const demandArray = [
    demandDataList.leftDemand,
    demandDataList.middleDemand,
    demandDataList.rightDemand,
  ];
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/demandShopWindow/post`,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(demandArray),
      types: [
        'REQUEST_SAVE_DEMAND_WINDOW',
        'SAVE_DEMAND_WINDOW_SUCCESS',
        'SAVE_DEMAND_WINDOW_ISSUES',
      ],
    },
  };
};

export const saveDemandv2 = (form) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/demand/save/v2`,
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      types: ['REQUEST', 'INSERT_DEMAND_SUCCESS', 'FAILURE'],
    },
  };
};

export const updateDemandv2 = (form) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/demand/update/v2`,
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      types: ['REQUEST', 'UPDATE_DEMAND_SUCCESS', 'FAILURE'],
    },
  };
};

export const getDemand = (basicId, demandId) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/demand/content?basicId=${basicId}&demandId=${demandId}`,
      method: 'GET',
      credentials: 'include',
      types: ['REQUEST', 'LOAD_DEMAND_SUCCESS', 'FAILURE'],
    },
  };
};

export const closeDemand = (form) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/demand/close`,
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      types: ['REQUEST', 'CLOSE_DEMAND_SUCCESS', 'FAILURE'],
    },
  };
};
export const writeDemandMemo = (demandId, form) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/demand/writeDemandMemo?demandId=${demandId}`,
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      types: ['REQUEST', 'INSERT_DEMAND_MEMO_SUCCESS', 'FAILURE'],
    },
  };
};

export const queryDemandListByKey = (keyType, key, isContacter) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/demand/list/${keyType}?key=${encodeURIComponent(key)}&demandContacter=${isContacter}`,
      method: 'GET',
      credentials: 'include',
      types: ['REQUEST', 'LOAD_DEMAND_LIST_SUCCESS', 'FAILURE'],
    },
  };
};

export const queryPendingCase = (slot, nextKey) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/demand/pendingCase?slot=${slot}${
        nextKey ? '&lastKey=' + nextKey : ''
      }`,
      method: 'GET',
      credentials: 'include',
      types: ['REQUEST', 'LOAD_PENDING_DEMAND_LIST_SUCCESS', 'FAILURE'],
    },
  };
};

export const queryChecklistCase = (slot, nextKey) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/demand/checkListCase?slot=${slot}${
        nextKey ? '&lastKey=' + nextKey : ''
      }`,
      method: 'GET',
      credentials: 'include',
      types: ['REQUEST', 'LOAD_CHECK_DEMAND_LIST_SUCCESS', 'FAILURE'],
    },
  };
};

export const getDemanderDefaultInfo = (basicId) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/demand/contact/${basicId}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_DEMANDER_INFO',
        'LOAD_DEMANDER_DEFAULT_INFO_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const passCheck = (basicId, demandId) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/demand/${demandId}/checkPass/${basicId}`,
      method: 'PUT',
      credentials: 'include',
      types: [
        'REQUEST',
        'DEMANDER_CHECK_PASS_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const updateDemandExpire = (basicId, demandId, newExpireDate) => {
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/demand/expire?basicId=${basicId}&demandId=${demandId}&newExpireDate=${newExpireDate}`,
      method: 'PUT',
      credentials: 'include',
      types: ['UPDATE_DEMAND_EXPRIE_REQUEST', 'UPDATE_DEMAND_EXPRIE_SUCCESS', 'UPDATE_DEMAND_EXPRIE_FAILURE'],
    },
  };
};
