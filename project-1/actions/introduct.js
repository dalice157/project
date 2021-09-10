import { RSAA } from 'redux-api-middleware';
// import { loadUserInfo } from './basic';
import { loadGigDetail, loadSelfAchievement } from './common';


// 加入收藏
export const addGigFromIntroduct = gigId => ({
  [RSAA]: {
    endpoint: `/api/gig-introduct/add/${gigId}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST',
      'ADD_GIG_FROM_INTRODUCT',
      'FAILURE',
    ],
  },
});

// 刪除收藏
export const removeGigFromIntroduct = favoriteId => ({
  [RSAA]: {
    endpoint: `/api/gig-introduct/delete/${encodeURIComponent(favoriteId)}`,
    method: 'DELETE',
    credentials: 'include',
    types: [
      'REQUEST',
      'REMOVE_GIG_FROM_INTRODUCT',
      'FAILURE',
    ],
  },
});


// 加入其他列表收藏
export const addGigOtherFromIntroduct = gigId => ({
  [RSAA]: {
    endpoint: `/api/gig-introduct/add/${gigId}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST',
      'ADD_GIG_OTHER_FROM_INTRODUCT',
      'FAILURE',
    ],
  },
});

// 刪除其他列表收藏
export const removeGigOtherFromIntroduct = favoriteId => ({
  [RSAA]: {
    endpoint: `/api/gig-introduct/delete/${encodeURIComponent(favoriteId)}`,
    method: 'DELETE',
    credentials: 'include',
    types: [
      'REQUEST',
      'REMOVE_GIG_OTHER_FROM_INTRODUCT',
      'FAILURE',
    ],
  },
});

/**
 * 填寫資料頁的預設資訊
 */
export const getDefaultIntroductDemanderForm = () => ({
  [RSAA]: {
    endpoint: '/api/gig-introduct/defaultDemanderForm',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_INTRODUCT_DEFAULT_DEMAND_FROM',
      'FAILURE',
    ],
  },
});


/**
 * 啟用demander
 * @param {*} demandVerifyForm
 */
export const activateIntroductDemander = demandVerifyForm => ({
  [RSAA]: {
    endpoint: '/api/gig-introduct/activateDemander',
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      demandVerifyForm,
    }),
    types: [
      'REQUEST',
      'ACTIVATE_INTRODUCT_DEMANDER_SUCCESS',
      'FAILURE',
    ],
  },
});

// [需求者]快速發送其他需求 - 選單
export const loadIntroductInvitableDemands = topperId => ({
  [RSAA]: {
    endpoint: `/api/gig-introduct/getInvitableDemands/${topperId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_INTRODUCT_INVITABLE_DEMANDS_SUCCESS',
      'FAILURE',
    ],
  },
});


/**
 * introduct 繳納需求保證金
 * @param {*} demandId
 */
export const demandPaidSubmit = (demandId, partBId) => ({
  [RSAA]: {
    endpoint: `/api/gig-introduct/${partBId}/paid/${demandId}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST',
      'PAID_INTRODUCT_SUBMIT_SUCCESS',
      'FAILURE',
    ],
  },
});

/**
 * 新增需求
 * @param {*} demandForm
 */
export const addIntroductDemand = (demandBody) => {
  console.log(JSON.stringify(demandBody));
  return {
    [RSAA]: {
      endpoint: '/api/gig-introduct/saveDemand/',
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        demandBody,
      }),
      types: [
        'REQUEST',
        'SAVE_INTRODUCT_DEMAND_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

/**
 * 修改需求
 * @param {*} demandId
 * @param {*} demandForm
 */
export const modifyIntroductDemand = (demandId, demandBody) => {
  console.log(JSON.stringify(demandBody));
  return {
    [RSAA]: {
      endpoint: `/api/gig-introduct/saveDemand/${demandId}`,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        demandBody,
      }),
      types: [
        'REQUEST',
        'SAVE_INTRODUCT_DEMAND_SUCCESS',
        'FAILURE',
      ],
    },
  };
};
