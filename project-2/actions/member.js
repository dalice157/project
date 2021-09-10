import { RSAA } from 'redux-api-middleware';
import config from '../config/config';

const JAVA_URL = config.proxyAPI.domain;

export const getMemberMultiSearch = (multiSearchList, next) => {
  // 日期種類
  const { dateType } = multiSearchList;

  // 年月 ex:2020-03
  const { yearMonth } = multiSearchList.times;

  // 日期 ex:19
  const start = multiSearchList.times.start === null ? null : multiSearchList.times.start;
  const end = multiSearchList.times.end === null ? null : multiSearchList.times.end;

  // status code only greater than or equal to 0.
  const { onlineStatus } = multiSearchList;
  const { serviceStatus } = multiSearchList;
  const { blockStatus } = multiSearchList;
  const { memberStatus } = multiSearchList;
  const { oldSiteType } = multiSearchList;

  let queryList = `dateType=${dateType}&yearMonth=${yearMonth}&memberStatus=${memberStatus}&onlineStatus=${onlineStatus}&serviceStatus=${serviceStatus}&blockStatus=${blockStatus}&oldSiteType=${oldSiteType}`;

  // 日期 （非必要）
  if (start !== '' && end !== '' && start !== undefined && end !== undefined && start !== null && end !== null) {
    queryList = (start === '' || end === '') ? queryList : queryList.concat('&start=').concat(start).concat('&end=').concat(end);
  }
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/member/multiSearch?&${queryList}${next ? `&lastKey=${next}` : ''}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_MEMBER_MULTIPLE_SEARCH',
        'LOAD_MEMBER_MULTIPLE_SEARCH_SUCCESS',
        'LOAD_MEMBER_MULTIPLE_SEARCH_ISSUES',
      ],
    },
  };
};

export const queryMemberListByKey = (keyType, key) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/list/${keyType}?key=${encodeURIComponent(key)}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_SINGLE_MEMBER_SEARCH',
      'SINGLE_MEMBER_SEARCH_SUCCESS',
      'SINGLE_MEMBER_SEARCH_ISSUES',
    ],
  },
});

export const getMember = (basicId, memoType = 'Basic') => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/${basicId}?memoType=${memoType}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_MEMBER_SUCCESS',
      'FAILURE',
    ],
  },
});

export const editMemberData = (basicId, form) => {
  console.log('editMemberData basicId', basicId);
  console.log('editMemberData form ===', JSON.stringify(form));
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/member/update/${basicId}`,
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      types: [
        'REQUEST',
        'UPDATE_MEMBER_DATA_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const writeMemberMemo = form => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/writeMemberMemo`,
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
    types: [
      'REQUEST',
      'INSERT_MEMBER_MEMO_SUCCESS',
      'FAILURE',
    ],
  },
});

export const writeGigMemo = (form, gigId) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/writeGigMemo?gigId=${gigId}`,
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
    types: [
      'REQUEST_WRITE_GIG_MEMO',
      'WRITE_GIG_MEMO_SUCCESS',
      'FAILURE',
    ],
  },
});


export const getCancelInfo = basicId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/cancelInfo/${basicId}`,
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    types: [
      'REQUEST',
      'LOAD_CANCEL_INFO_SUCCESS',
      'FAILURE',
    ],
  },
});

export const deleteTop = basicId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/cancel/${basicId}`,
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    types: [
      'REQUEST',
      'DELETE_TOP_MEMBER_SUCCESS',
      'FAILURE',
    ],
  },
});

export const acDeleteProcess = (basicId, isPid) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/getAcDeleteToken/${basicId}${isPid ? '?keyType=2' : ''}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_AC_DELETE_TOKEN_SUCCESS',
      'FAILURE',
    ],
  },
});

export const loadDeleteAccountList = () => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/getDeleteAccountList/`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_DELETE_ACCOUNT_LIST_SUCCESS',
      'FAILURE',
    ],
  },
});

export const loadDeleteAccountRecord = recordId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/getDeleteAccountRecord/${recordId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_DELETE_ACCOUNT_RECORD_SUCCESS',
      'FAILURE',
    ],
  },
});

export const updateDeleteAccountRecord = (form) => {
  const { recordId, handleStatus, memo } = form;
  let queryString = `handleStatus=${handleStatus}`;
  if (memo !== undefined && memo !== '') {
    queryString = `${queryString}&inputMemo=${memo}`;
  }
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/member/update/deleteAccountRecord/${recordId}?${queryString}`,
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      types: [
        'REQUEST',
        'UPDATE_DELETE_ACCOUNT_RECORD_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const generateTopBasic = (form) => {
  const { pidList } = form;
  const pidArr = [];
  pidList.split(',').forEach((pid) => {
    pidArr.push(pid);
  });

  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/member/generateOldSiteMemberBasic/${form.importSource}`,
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pidArr),
      types: [
        'REQUEST',
        'INSERT_OLDSITE_TOPPER_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const generateDemanderBasic = form => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/generateDemanderBasic/${form.pid}`,
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    types: [
      'REQUEST',
      'GENERATE_DEMANDER_BASIC_SUCCESS',
      'FAILURE',
    ],
  },
});

export const getDemanderInfo = basicId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/getDemanderInfo/${basicId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_DEMANDER_INFO_SUCCESS',
      'FAILURE',
    ],
  },
});

export const getReviewList = basicId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/review/get/${basicId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_REVIEW_ITEM_LIST_SUCCESS',
      'FAILURE',
    ],
  },
});

export const writeReviewItem = (basicId, form) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/review/write/${basicId}`,
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
    types: [
      'REQUEST',
      'WRITE_REVIEW_ITEM_LIST_SUCCESS',
      'FAILURE',
    ],
  },
});

// 後台刪除評價
export const deleteReviewItem = (basicId, deleteDealCount, memo, reviewId) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/review/${basicId}?deleteDealCount=${deleteDealCount}&memo=${memo}&reviewId=${reviewId}`,
    method: 'DELETE',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_DELETE_REMOVE_ITEM_SUCCESS',
      'FAILURE',
    ],
  },
});

export const staffManualVerify = (basicId, form) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/manualVerify/${basicId}`,
    method: 'PUT',
    body: JSON.stringify(form),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    types: [
      'REQUEST',
      'STAFF_MANUAL_VERIFY_SUCCESS',
      'FAILURE',
    ],
  },
});
export const sendVerifyEmail = (basicId, email) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/sendMail/${basicId}`,
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: email,
    types: [
      'REQUEST',
      'SEND_VERIFY_EMAIL_SUCCESS',
      'FAILURE',
    ],
  },
});

export const loadGigContent = (basicId, gigId) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/content?basicId=${basicId}&gigId=${gigId}`,
    method: 'GET',
    types: [
      'REQUEST_GIG_CONTENT',
      'GIG_CONTENT_SUCCESS',
      'GIG_CONTENT_FAILURE',
    ],
  },
});

export const updateGigContent = gig => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/update`,
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gig),
    types: [
      'REQUEST_GIG_UPDATE',
      'GIG_UPDATE_SUCCESS',
      'GIG_UPDATE_FAILURE',
    ],
  },
});

export const loadTopperName = basicId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/topperName?basicId=${basicId}`,
    method: 'GET',
    types: [
      'REQUEST_TOPPER_NAME',
      'TOPPER_NAME_SUCCESS',
      'TOPPER_NAME_FAILURE',
    ],
  },
});

export const loadHistory = (basicId, lastKey, year) => {
  const isLastKey = lastKey ? `&lastKey=${lastKey}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/gig/list/publishRecord?basicId=${basicId}${isLastKey}&year=${year}`,
      method: 'GET',
      types: [
        'REQUEST',
        'GET_HISTORY_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const checkCancelGigPublish = basicId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/check/cancelPublish/${basicId}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [
      'REQUEST_CHECK_CANCEL_GIG_PUBLISH',
      'CHECK_CANCEL_GIG_PUBLISH_SUCCESS',
      'FAILURE',
    ],
  },
});
export const getOldSiteInfo = basicId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/get/oldsiteInfo/${basicId}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [
      'REQUEST_GET_OLDSITE_INFO',
      'SUCCESS_GET_OLDSITE_INFO',
      'FAILURE_GET_OLDSITE_INFO',
    ],
  },
});

export const syncTutorInfo = basicId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/sync/tutor?basicId=${basicId}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    types: [
      'REQUEST_SYNC_TUTOR_INFO',
      'SUCCESS_SYNC_TUTOR_INFO',
      'FAILURE_SYNC_TUTOR_INFO',
    ],
  },
});


export const cancelGigPublish = (basicId, reason, reasonOpt) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/cancelPublish?basicId=${basicId}&reason=${reason}&reasonOpt=${reasonOpt}`,
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    types: [
      'REQUEST_CANCEL_GIG_PUBLISH',
      'CANCEL_GIG_PUBLISH_SUCCESS',
      'FAILURE_CANCEL_GIG_PUBLISH',
    ],
  },
});

export const loadGigDashboard = basicId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/dashboard?basicId=${basicId}`,
    method: 'GET',
    types: [
      'REQUEST_GIG_DASHBOARD',
      'GIG_DASHBOARD_SUCCESS',
      'FAILURE_GIG_DASHBOARD',
    ],
  },
});

export const loadGigDashboardv2 = basicId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/dashboard/v2?basicId=${basicId}`,
    method: 'GET',
    types: [
      'REQUEST_GIG_DASHBOARD',
      'GIG_DASHBOARD_SUCCESS',
      'FAILURE_GIG_DASHBOARD',
    ],
  },
});

export const loadGigQuotation = (basicId, lastKey, year) => {
  const isLastKey = lastKey ? `&lastKey=${lastKey}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/gig/list/quotation?basicId=${basicId}&year=${year}${isLastKey}`,
      method: 'GET',
      types: [
        'REQUEST_GIG_QUOTATION',
        'GIG_QUOTATION_SUCCESS',
        'FAILURE_GIG_QUOTATION',
      ],
    },
  };
};

export const loadGigInviting = (basicId, lastKey) => {
  const isLastKey = lastKey ? `&lastKey=${lastKey}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/gig/list/demand/inviting?basicId=${basicId}${isLastKey}`,
      method: 'GET',
      types: [
        'REQUEST_GIG_INVITING',
        'GIG_INVITING_SUCCESS',
        'FAILURE_GIG_INVITING',
      ],
    },
  };
};

// 即將拿掉
export const getPublishRecords = basicId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/getPublishRecords?basicId=${basicId}`,
    method: 'GET',
    types: [
      'REQUEST_PUBLISH_RECORD',
      'PUBLISH_RECORD_SUCCESS',
      'FAILURE_PUBLISH_RECORD',
    ],
  },
});

export const getContactRecords = basicId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/getContactsRec/keys?basicId=${basicId}`,
    method: 'GET',
    types: [
      'REQUEST_CONTACT_RECORD',
      'CONTACT_RECORD_SUCCESS',
      'FAILURE_CONTACT_RECORD',
    ],
  },
});

export const loadGigContacts = (basicId, lastKey, orderId, recordStartDate) => {
  const isLastKey = lastKey ? `&lastKey=${lastKey}` : '';
  const isOrderId = orderId ? `&orderId=${orderId}` : '';
  const isRecordStartDate = recordStartDate ? `&recordStartDate=${encodeURIComponent(recordStartDate)}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/gig/list/getContacts?basicId=${basicId}${isLastKey}${isOrderId}${isRecordStartDate}`,
      method: 'GET',
      types: [
        'REQUEST_GET_GIG_CONTACTS',
        'GET_GIG_CONTACTS_SUCCESS',
        'FAILURE_GET_GIG_CONTACTS',
      ],
    },
  };
};

export const loadGigCooperating = (basicId, lastKey) => {
  const isLastKey = lastKey ? `&lastKey=${lastKey}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/gig/list/demand/cooperating?basicId=${basicId}${isLastKey}`,
      method: 'GET',
      types: [
        'REQUEST_GIG_COOPERATING',
        'GIG_COOPERATING_SUCCESS',
        'FAILURE_GIG_COOPERATING',
      ],
    },
  };
};

export const getTitleList = topperId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/titleList?topperId=${topperId}`,
    method: 'GET',
    types: [
      'REQUEST_GIG_TITLELIST',
      'GIG_TITLELIST_SUCCESS',
      'FAILURE_GIG_TITLELIST',
    ],
  },
});

export const sendTitleInfo = (demandId, demanderId, gigId, topperId) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/askReview?demandId=${demandId}&demanderId=${demanderId}&gigId=${gigId}&topperId=${topperId}`,
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    types: [
      'REQUEST_SEND_TITLE_INFO',
      'SEND_TITLE_INFO_SUCCESS',
      'FAILURE_SEND_TITLE_INFO',
    ],
  },
});

export const loadGigClosed = (basicId, lastKey, year) => {
  const isLastKey = lastKey ? `&lastKey=${lastKey}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/gig/list/demand/closed?basicId=${basicId}${isLastKey}&year=${year}`,
      method: 'GET',
      types: [
        'REQUEST_GIG_CLOSED',
        'GIG_CLOSED_SUCCESS',
        'FAILURE_GIG_CLOSED',
      ],
    },
  };
};

export const sendReportCooperate = (demandId, demanderId, topperId) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/reportCooperate?demandId=${demandId}&demanderId=${demanderId}&topperId=${topperId}`,
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    types: [
      'REQUEST_SEND_REPORT_COOPERATE',
      'SEND_REPORT_COOPERATE_SUCCESS',
      'FAILURE_SEND_REPORT_COOPERATE',
    ],
  },
});

export const loadCooperatedRecord = (basicId, lastKey, year) => {
  const isLastKey = lastKey ? `&lastKey=${lastKey}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/gig/list/cooperatedRecord?basicId=${basicId}${isLastKey}&year=${year}`,
      method: 'GET',
      types: [
        'REQUEST_COOPERATED_RECORD',
        'COOPERATED_RECORD_SUCCESS',
        'FAILURE_COOPERATED_RECORD',
      ],
    },
  };
};

export const loadInvitedRecord = (basicId, lastKey, year) => {
  const isLastKey = lastKey ? `&lastKey=${lastKey}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/gig/list/invitedRecord?basicId=${basicId}${isLastKey}&year=${year}`,
      method: 'GET',
      types: [
        'REQUEST_INVITED_RECORD',
        'INVITED_RECORD_SUCCESS',
        'FAILURE_INVITED_RECORD',
      ],
    },
  };
};

export const loadCommunicating = (basicId, lastKey) => {
  const isLastKey = lastKey ? `&lastKey=${lastKey}` : '';
  return {
    [RSAA]: {
      endpoint: `${JAVA_URL}/bs/gig/list/demand/communicating?basicId=${basicId}${isLastKey}`,
      method: 'GET',
      types: [
        'REQUEST_COMMUNICATING',
        'COMMUNICATING_SUCCESS',
        'FAILURE_COMMUNICATING',
      ],
    },
  };
};

export const sendConfirmCooperate = (demandId, demanderId, topperId) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/gig/confirmCooperate?demandId=${demandId}&demanderId=${demanderId}&topperId=${topperId}`,
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    types: [
      'REQUEST_SEND_CONFIRM_COOPERATE',
      'SEND_CONFIRM_COOPERATE_SUCCESS',
      'FAILURE_SEND_CONFIRM_COOPERATE',
    ],
  },
});

export const creditChange = (basicId, credit) => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/creditChange/${basicId}?credit=${credit}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST',
      'CHANGE_CREDIT_SUCCESS',
      'CHANGE_CREDIT_ISSUES',
    ],
  },
});


export const initiatLoginToken = pid => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/member/initiatingToken/${pid}`,
    method: 'POST',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_INITIAT_LOGIN_SUCCESS',
      'LOAD_INITIAT_LOGIN_ISSUES',
    ],
  },
});

// 後台新增評價 - 取得案主的AC稱謂 [姓氏+稱謂]
export const loadReviewNameTitle = demanderId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/review/demander/nameTitle/${demanderId}`,
    method: 'GET',
    types: [
      'REQUEST_DEMANDER_NAMETITLE',
      'LOAD_DEMANDER_NAMETITLE_SUCCESS',
      'FAILURE_DEMANDER_NAMETITLE',
    ],
  },
});

// 後台新增評價 - 取得案件Title
export const loadReviewDemandTitle = demandId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/review/demandTitle?demandId=Demand-${demandId}`,
    method: 'GET',
    types: [
      'REQUEST_DEMAND_TITLE',
      'LOAD_DEMAND_TITLE_SUCCESS',
      'FAILURE_DEMAND_TITLE',
    ],
  },
});

// 後台新增評價 - 取得高手Gig的下拉選單
export const loadReviewTopperGigs = topperId => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/review/topper/gigs/${topperId}`,
    method: 'GET',
    types: [
      'REQUEST_TOPPER_GIGS',
      'LOAD_TOPPER_GIGS_SUCCESS',
      'FAILURE_TOPPER_GIGS',
    ],
  },
});

// 後台新增評價
export const addReviewForm = form => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/review`,
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
    types: [
      'REQUEST_ADD_REVIEW_FORM',
      'ADD_REVIEW_FORM_SUCCESS',
      'FAILURE_ADD_REVIEW_FORM',
    ],
  },
});


// 後台更新評價 顯示/隱藏
export const sendDisplayToggle = displayForm => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/review/displayToggle`,
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(displayForm),
    types: [
      'REQUEST_DISPLAY_TOGGLE',
      'SEND_DISPLAY_TOGGLE_SUCCESS',
      'FAILURE_DISPLAY_TOGGLE',
    ],
  },
});

export const initReviewForm = (reviewListData, reviewId) => {
  const reviewInfo = reviewListData.filter(item => item.reviewId === reviewId)[0];
  const demanderSex = reviewInfo.demander.slice(-2);
  const demanderNameLength = reviewInfo.demander.split('').length - 2;
  const demanderName = reviewInfo.demander.slice(0, demanderNameLength);
  return {
    type: 'INITIAL_REVIEW_FORM',
    payload: {
      ...reviewInfo,
      demanderSex,
      demanderName,
    },
  };
};

// 後台修改評價
export const updateReviewForm = reviewForm => ({
  [RSAA]: {
    endpoint: `${JAVA_URL}/bs/review`,
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewForm),
    types: [
      'REQUEST_UPDATE_REVIEW_FORM',
      'UPDATE_REVIEW_FORM_SUCCESS',
      'FAILURE_UPDATE_REVIEW_FORM',
    ],
  },
});
