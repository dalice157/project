import { RSAA } from 'redux-api-middleware';

const chkActiveProcessAction = redirectTo => ({
  [RSAA]: {
    endpoint: `/api/redirect/chkActiveProcess${redirectTo ? `?redirectTo=${redirectTo}` : ''}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'CHECK_USER_PASS',
      'FAILURE',
    ],
  },
});

export const checkMemberPublishDemand = (demandType, redirectTo) => {
  const queryString = `?${demandType ? `demandType=${demandType}` : ''}${redirectTo ? `&redirectTo=${redirectTo}` : ''}`;
  return {
    [RSAA]: {
      endpoint: `/api/redirect/checkPublishDemand${queryString}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_CHECK_MEMBER_PUBLISH_DEMAND',
        'CHECK_MEMBER_PUBLISH_DEMAND_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const chkActiveProcess = redirectTo => async (dispatch) => {
  const action = await dispatch(chkActiveProcessAction(redirectTo));
  // 因為 RSAA FAILURE, 不會跑reject, 所以用非同步方法把他分開
  return action.error ? Promise.reject(action) : Promise.resolve(action);
};

export const loadTopperIntro = topperId => ({
  [RSAA]: {
    endpoint: `/api/common/shareProfile/${topperId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_TOPPER_INTRO',
      'LOAD_TOPPER_INTRO_ISSUES',
    ],
  },
});

// 取得最新案件電子報的訂閱狀況
export const onCheckSubscribe = payload => ({
  [RSAA]: {
    endpoint: `/api/subscribe/check?payload=${payload}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_CHECK_UNSUBSCRIBE',
      'CHECK_UNSUBSCRIBE_SUCCESS',
      'FAILURE_CHECK_UNSUBSCRIBE',
    ],
  },
});

// 取消訂閱
export const onUnSubscribe = payload => ({
  [RSAA]: {
    endpoint: `/api/subscribe/cancel?payload=${payload}`,
    method: 'DELETE',
    credentials: 'include',
    types: [
      'REQUEST_UNSUBSCRIBE',
      'LOAD_UNSUBSCRIBE_SUCCESS',
      'FAILURE_UNSUBSCRIBE',
    ],
  },
});

export const loadStaticArea = () => ({
  [RSAA]: {
    endpoint: '/api/staticArea',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_STATIC_AREA_SUCCESS',
      'LOAD_STATIC_AREA_ISSUES',
    ],
  },
});

export const loadStaticIndust = () => ({
  [RSAA]: {
    endpoint: '/api/staticIndust',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_STATIC_INDUST_SUCCESS',
      'LOAD_STATIC_INDUST_ISSUES',
    ],
  },
});

export const queryGigs = queryString => ({
  [RSAA]: {
    endpoint: `/api/search${queryString}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_GIGLIST',
      'LOAD_GIGLIST_SUCCESS',
      'LOAD_GIGLIST_ISSUES',
    ],
  },
});

export const getBasic = basicId => ({
  [RSAA]: {
    endpoint: `/api/profile/${basicId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_BASIC_SUCCESS',
      'FAILURE',
    ],
  },
});

export const getProfileGigs = basicId => ({
  [RSAA]: {
    endpoint: `/api/profile/gigs/${basicId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_PROFILE_GIGS_SUCCESS',
      'FAILURE',
    ],
  },
});

export const loadProfileInvitableDemands = topperId => ({
  [RSAA]: {
    endpoint: `/api/profile/getInvitableDemands/${topperId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_PROFILE_INVITABLE_DEMANDS_SUCCESS',
      'FAILURE',
    ],
  },
});

export const sendVerifySMS = cellphone => ({
  [RSAA]: {
    endpoint: '/api/verify/sendVerifySMS',
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cellphone,
    }),
    types: [
      'REQUEST_SEND_VERIFY_SMS',
      'SEND_VERIFY_SMS_SUCCESS',
      'FAILURE_SEND_VERIFY_SMS',
    ],
  },
});

export const resetSendVerifySMS = () => (dispatch) => {
  dispatch({
    type: 'RESET_SEND_VERIFY_SMS_SUCCESS',
  });
};

export const sendVerifyCellphone = (cellphone, token) => ({
  [RSAA]: {
    endpoint: `/api/verify/verifyCellphone/${cellphone}/${token}`,
    method: 'POST',
    credentials: 'include',
    types: [
      'REQUEST',
      'SEND_VERIFY_CELLPHONE_SUCCESS',
      'SEND_VERIFY_CELLPHONE_FAILURE',
    ],
  },
});

export const loadBlockInfo = basicId => ({
  [RSAA]: {
    endpoint: `/api/profile/blockInfo/${basicId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_BLOCKINFO',
      'FAILURE',
    ],
  },
});

export const loadReviewCheck = basicId => ({
  [RSAA]: {
    endpoint: `/api/review/check/${basicId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_REVIEW_CHECK',
      'FAILURE',
    ],
  },
});


// 服務評價 - 取得side bar 的GigList
export const loadGigList = (basicId, gigId, page, type) => dispatch => dispatch({
  [RSAA]: {
    endpoint: `/api/review/gigList/${basicId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_GIGLIST',
      'FAILURE',
    ],
  },
}).then((response) => {
  if (response && response.payload[0]) {
    const gigIdList = response.payload.map(item => item.gigId);
    // gigId=0: 沒帶gigId參數預設顯示第一個，有帶參數則檢查是否有在sideBar的GigId裡面，若否，顯示Gig-Other
    const isGigIdFinded = gigIdList.includes(gigId);
    const payloadGigId = gigId === 0 ? response.payload[0].gigId : (isGigIdFinded ? gigId : 'Gig-Other');
    dispatch(
      loadReviewGig(basicId, payloadGigId),
    );
    dispatch(
      loadReviewItemList(basicId, payloadGigId, page || 1, type || 0),
    );
  }
});

// 服務評價 - 高手的個人總體平均
export const loadReviewAvg = basicId => ({
  [RSAA]: {
    endpoint: `/api/reviewAvg/${basicId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_REVIEW_AVG',
      'FAILURE',
    ],
  },
});

// 服務評價 - 高手的單一Gig總評
export const loadReviewGig = (basicId, gigId) => ({
  [RSAA]: {
    endpoint: `/api/reviewGig/${basicId}/${gigId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_REVIEW_GIG',
      'FAILURE',
    ],
  },
});

// 服務評價 - 高手的單一Gig總評
export const loadReviewItemList = (basicId, gigId, page, filterBy) => ({
  [RSAA]: {
    endpoint: `/api/reviewItemList/${basicId}/${gigId}/${page}/${filterBy}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_REVIEW_ITEM_LIST',
      'FAILURE',
    ],
  },
});

// 個人服務介紹頁 - 右側個人成就資訊
export const loadGigDetail = (basicId, gigId = '') => ({
  [RSAA]: {
    endpoint: `/api/gig-detail/${basicId}/${gigId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_GIG_DETAIL_SUCCESS',
      'FAILURE',
    ],
  },
});

// 個人服務介紹頁 - 左側個人成就資訊
export const loadSelfAchievement = basicId => ({
  [RSAA]: {
    endpoint: `/api/gig-self-achievement/${basicId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_SELF_ACHIEVEMENT_SUCCESS',
      'FAILURE',
    ],
  },
});

export const queryDemandList = queryString => ({
  [RSAA]: {
    endpoint: `/api/caseList/search${queryString}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_CASELIST',
      'LOAD_CASELIST_SUCCESS',
      'FAILURE',
    ],
  },
});


export const getAreaToCase = queryString => dispatch => dispatch(loadStaticArea()).then(
  () => {
    dispatch(queryDemandList(queryString));
  },
  () => {
  },
);

export const queryBasicTutorDemand = () => {
  const queryString = '?cats=1001001,1003001&priceMin=350&clientCats=2&size=4';
  return {
    [RSAA]: {
      endpoint: `/api/caseList/search${queryString}`,
      method: 'GET',
      types: [
        'REQUEST_BASIC_TUTOR_DEMAND',
        'LOAD_BASIC_TUTOR_DEMAND_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const queryExpertTutorDemand = () => {
  const queryString = '?cats=1000000&priceMin=500&size=4';
  return {
    [RSAA]: {
      endpoint: `/api/caseList/search${queryString}`,
      method: 'GET',
      types: [
        'REQUEST_EXPERT_TUTOR_DEMAND',
        'LOAD_EXPERT_TUTOR_DEMAND_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const queryBasicCaseDemand = () => {
  const queryString = '?cats=2000000,3000000,4000000,5000000,6000000,7000000,8000000&priceMax=5000&size=4';
  return {
    [RSAA]: {
      endpoint: `/api/caseList/search${queryString}`,
      method: 'GET',
      types: [
        'REQUEST_BASIC_CASE_DEMAND',
        'LOAD_BASIC_CASE_DEMAND_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

export const queryExpertCaseDemand = () => {
  const queryString = '?cats=2000000,3000000,4000000,5000000,6000000,7000000,8000000&priceMin=10000&size=4';
  return {
    [RSAA]: {
      endpoint: `/api/caseList/search${queryString}`,
      method: 'GET',
      types: [
        'REQUEST_EXPERT_CASE_DEMAND',
        'LOAD_EXPERT_CASE_DEMAND_SUCCESS',
        'FAILURE',
      ],
    },
  };
};


export const getContent = (basicId, demandId) => ({
  [RSAA]: {
    endpoint: `/api/common/demand/caseInfo?basicId=${basicId}&demandId=${demandId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'LOAD_CONTENT_REQUEST',
      'LOAD_CONTENT_SUCCES',
      'LOAD_CONTENT_FAILURE',
    ],
  },
});


export const getAreaToContent = (basicId, demandId) => dispatch => dispatch(loadStaticArea()).then(
  () => {
    dispatch(getContent(basicId, demandId));
  },
  () => {
  },
);

export const preConfirmCooperate = payload => ({
  [RSAA]: {
    endpoint: `/api/common/demanderConfirmCooperate?payload=${payload}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_PRECONFIRM_COOPERATE',
      'LOAD_PRECONFIRM_COOPERATE',
      'FAILURE',
    ],
  },
});

export const confirmCooperate = payload => ({
  [RSAA]: {
    endpoint: `/api/common/demanderConfirmCooperate?payload=${payload}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST_CONFIRM_COOPERATE',
      'LOAD_CONFIRM_COOPERATE',
      'FAILURE',
    ],
  },
});

export const loadAskReviewInfo = payload => ({
  [RSAA]: {
    endpoint: `/api/common/askReviewInfo?payload=${payload}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_ASKREVIEW',
      'LOAD_ASKREVIEW',
      'FAILURE',
    ],
  },
});

// 案主經「高手邀請評價信」寫入評價
export const evaluateTopperFromEDM = (payload, body) => ({
  [RSAA]: {
    endpoint: `/api/common/review?payload=${payload}`,
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    types: [
      'REQUEST_EVALUATE_EDM',
      'LOAD_EVALUATE_EDM',
      'FAILURE',
    ],
  },
});

// 手機版首頁使用
export const getGigDemandCount = () => ({
  [RSAA]: {
    endpoint: '/api/common/gigDemandCount',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_GIGDEMANDCOUNT',
      'LOAD_GIGDEMANDCOUNT_SUCCESS',
      'FAILURE_GIGDEMANDCOUNT',
    ],
  },
});

// 首頁-精選師資
export const getPickupTutor = () => ({
  [RSAA]: {
    endpoint: '/api/common/pickupTutor',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_PICKUPTUTOR',
      'LOAD_PICKUPTUTOR_SUCCESS',
      'FAILURE_PICKUPTUTOR',
    ],
  },
});

// 首頁-精選接案高手
export const getPickupOutsource = () => ({
  [RSAA]: {
    endpoint: '/api/common/pickupOutsource',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_PICKUPOUTSOURCE',
      'LOAD_PICKUPOUTSOURCE_SUCCESS',
      'FAILURE_PICKUPOUTSOURCE',
    ],
  },
});


// 首頁-外包成功案例
export const getSuccessOutsourceDemand = () => ({
  [RSAA]: {
    endpoint: '/api/common/successOutsourceDemand',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_SUCCESS_OUTSOURCE_DEMAND',
      'LOAD_SUCCESS_OUTSOURCE_DEMAND',
      'FAILURE_SUCCESS_OUTSOURCE_DEMAND',
    ],
  },
});

// 首頁-家教成功案例
export const getSuccessTutorDemand = () => ({
  [RSAA]: {
    endpoint: '/api/common/successTutorDemand',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_SUCCESS_TUTOR_DEMAND',
      'LOAD_SUCCESS_TUTOR_DEMAND',
      'FAILURE_SUCCESS_TUTOR_DEMAND',
    ],
  },
});

// 首頁-熱門分類
export const loadGigDemandPopularCats = () => ({
  [RSAA]: {
    endpoint: '/api/common/gigDemandPopularCats',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_POPULARCATS_HOME',
      'LOAD_POPULARCATS_HOME',
      'FAILURE_POPULARCATS_HOME',
    ],
  },
});
