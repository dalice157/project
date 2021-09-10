import { RSAA } from 'redux-api-middleware';

export const getPaidRecord = () => ({
  [RSAA]: {
    endpoint: '/api/gigManage/paidRecord',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_GET_PAID_RECORD',
      'GET_PAID_RECORD_SUCCESS',
      'FAILURE',
    ],
  },
});

export const getWatchDealList = (dealStep) => {
  const isDealStep = (dealStep === 1 || dealStep === 2 || dealStep === 3) ? dealStep : 0;
  return {
    [RSAA]: {
      endpoint: `/api/gigManage/get/watchDealList?dealStep=${isDealStep}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'GET_WATCH_DEAL_LIST_REQUEST',
        'GET_WATCH_DEAL_LIST_SUCCESS',
        'GET_WATCH_DEAL_LIST_FAILURE',
      ],
    },
  };
};

export const getListContact = (lastKey, yearMonth) => {
  const isLastKey = lastKey || '';
  return {
    [RSAA]: {
      endpoint: `/api/gigManage/list/getContact?lastKey=${isLastKey}&yearMonth=${yearMonth}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'GET_LIST_CONTACT_REQUEST',
        'GET_LIST_CONTACT_SUCCESS',
        'GET_LIST_CONTACT_FAILURE',
      ],
    },
  };
};

export const checkPublish = () => ({
  [RSAA]: {
    endpoint: '/api/gigManage/check/publish',
    method: 'GET',
    credentials: 'include',
    types: [
      'CHECK_PUBLISH_REQUEST',
      'CHECK_PUBLISH_SUCCESS',
      'CHECK_PUBLISH_FAILURE',
    ],
  },
});

export const reportCooperation = (demandId, demanderId, from) => ({
  [RSAA]: {
    endpoint: `/api/gigManage/reportCooperation?demandId=${demandId}&demanderId=${demanderId}&from=${from}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REPORT_COOPERTATION_REQUEST',
      'REPORT_COOPERTATION_SUCCESS',
      'REPORT_COOPERTATION_FAILURE',
    ],
  },
});

export const confirmCooperation = (demandId, demanderId, from) => ({
  [RSAA]: {
    endpoint: `/api/gigManage/confirmCooperation?demandId=${demandId}&demanderId=${demanderId}&from=${from}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'CONFIRM_COOPERTATION_REQUEST',
      'CONFIRM_COOPERTATION_SUCCESS',
      'CONFIRM_COOPERTATION_FAILURE',
    ],
  },
});

export const getTitleList = () => ({
  [RSAA]: {
    endpoint: '/api/gigManage/titleList',
    method: 'GET',
    credentials: 'include',
    types: [
      'GET_TITLE_LIST_REQUEST',
      'GET_TITLE_LIST_SUCCESS',
      'GET_TITLE_LIST_FAILURE',
    ],
  },
});

export const sendAskReview = (demandId, demanderId, from, gigId) => ({
  [RSAA]: {
    endpoint: `/api/gigManage/askReview?demandId=${demandId}&demanderId=${demanderId}&from=${from}&gigId=${gigId}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'SEND_ASK_REVIEW_REQUEST',
      'SEND_ASK_REVIEW_SUCCESS',
      'SEND_ASK_REVIEW_FAILURE',
    ],
  },
});

export const loadGetContact = () => ({
  [RSAA]: {
    endpoint: '/api/gigManage/load/getContact',
    method: 'GET',
    credentials: 'include',
    types: [
      'LOAD_GET_CONTACT_REQUEST',
      'LOAD_GET_CONTACT_SUCCESS',
      'LOAD_GET_CONTACT_FAILURE',
    ],
  },
});

export const getReview = demandId => ({
  [RSAA]: {
    endpoint: `/api/gigManage/getReview?demandId=${demandId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'GET_REVIEW_REQUEST',
      'GET_REVIEW_SUCCESS',
      'GET_REVIEW_FAILURE',
    ],
  },
});

export const getContact = demandId => ({
  [RSAA]: {
    endpoint: `/api/gigManage/getContact?demandId=${demandId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'GET_CONTACT_REQUEST',
      'GET_CONTACT_SUCCESS',
      'GET_CONTACT_FAILURE',
    ],
  },
});

export const loadGigDashboard = () => ({
  [RSAA]: {
    endpoint: '/api/gigManage/dashboard/',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_GIG_DASHBOARD',
      'LOAD_GIG_DASHBOARD',
      'FAILURE',
    ],
  },
});

export const loadBlockInfo = () => ({
  [RSAA]: {
    endpoint: '/api/gigManage/blockInfo/',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_TOPPER_BLOCKINFO',
      'LOAD_TOPPER_BLOCKINFO',
      'FAILURE_TOPPER_BLOCKINFO',
    ],
  },
});

export const loadInvitingList = (lastKey) => {
  const queryString = lastKey ? `${lastKey}` : 'initial';
  return {
    [RSAA]: {
      endpoint: `/api/gigManage/invitingList/${queryString}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_INVITING_LIST',
        'LOAD_INVITING_LIST',
        'FAILURE',
      ],
    },
  };
};

export const agreeToCommunicate = (demandId, demanderId) => ({
  [RSAA]: {
    endpoint: `/api/gigManage/communicate/${demandId}/${demanderId}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'AGREE_TO_COMMUNICATE',
      'LOAD_AGREE_TO_COMMUNICATE',
      'FAILURE',
    ],
  },
});

export const rejectToCommunicate = (demandId, demanderId) => ({
  [RSAA]: {
    endpoint: `/api/gigManage/reject/${demandId}/${demanderId}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REJECT_TO_COMMUNICATE',
      'LOAD_REJECT_TO_COMMUNICATE',
      'FAILURE',
    ],
  },
});

export const loadCommunicatingList = (lastKey) => {
  const queryString = lastKey ? `${lastKey}` : 'initial';
  return {
    [RSAA]: {
      endpoint: `/api/gigManage/communicatingList/${queryString}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_COMMUNICATING_LIST',
        'LOAD_COMMUNICATING_LIST',
        'FAILURE',
      ],
    },
  };
};

export const getListQuotation = (lastKey, yearMonth) => {
  const isLastKey = lastKey || '';
  return {
    [RSAA]: {
      endpoint: `/api/gigManage/list/quotation?lastKey=${isLastKey}&yearMonth=${yearMonth}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'GET_LIST_QUOTATION_REQUEST',
        'GET_LIST_QUOTATION_SUCCESS',
        'GET_LIST_QUOTATION_FAILURE',
      ],
    },
  };
};

export const getListClosed = (lastKey, yearMonth) => {
  const isLastKey = lastKey || '';
  return {
    [RSAA]: {
      endpoint: `/api/gigManage/list/closed?lastKey=${isLastKey}&yearMonth=${yearMonth}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'GET_LIST_CLOSED_REQUEST',
        'GET_LIST_CLOSED_SUCCESS',
        'GET_LIST_CLOSED_FAILURE',
      ],
    },
  };
};

export const getListCooperating = (lastKey) => {
  const isLastKey = lastKey || '';
  return {
    [RSAA]: {
      endpoint: `/api/gigManage/list/cooperating?lastKey=${isLastKey}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'GET_LIST_COOPERATING_REQUEST',
        'GET_LIST_COOPERATING_SUCCESS',
        'GET_LIST_COOPERATING_FAILURE',
      ],
    },
  };
};
