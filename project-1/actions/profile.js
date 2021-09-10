import { RSAA } from 'redux-api-middleware';

/**
 * 填寫資料頁的預設資訊
 */
export const getDefaultProfileDemanderForm = () => {
  return {
    [RSAA]: {
      endpoint: '/api/profile/form/defaultDemanderForm',
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'LOAD_PROFILE_DEFAULT_DEMAND_FROM',
        'FAILURE',
      ]
    }
  };
};

/**
 * 新增需求
 * @param {*} demandForm
 */
export const addProfileDemand = (demandBody) => {
  console.log(JSON.stringify(demandBody));
  return {
    [RSAA]: {
      endpoint: '/api/profile/saveDemand/',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demandBody: demandBody }),
      types: [
        'REQUEST',
        'SAVE_PROFILE_DEMAND_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * 修改需求
 * @param {*} demandId
 * @param {*} demandForm
 */
export const modifyProfileDemand = (demandId, demandBody) => {
  console.log(JSON.stringify(demandBody));
  return {
    [RSAA]: {
      endpoint: '/api/profile/saveDemand/' + demandId,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        demandBody: demandBody
      }),
      types: [
        'REQUEST',
        'SAVE_PROFILE_DEMAND_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * 啟用demander
 * @param {*} demandVerifyForm
 */
export const activateProfileDemander = (demandVerifyForm) => {
  console.log(JSON.stringify(demandVerifyForm));
  return {
    [RSAA]: {
      endpoint: '/api/profile/activateDemander',
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        demandVerifyForm: demandVerifyForm
      }),
      types: [
        'REQUEST',
        'ACTIVATE_PROFILE_DEMANDER_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * profile 繳納需求保證金
 * @param {*} demandId
 */
export const demandPaidSubmit = (demandId, partBId) => {
  return {
    [RSAA]: {
      endpoint: '/api/profile/' + partBId + '/paid/' + demandId,
      method: 'PUT',
      credentials: 'include',
      types: [
        'REQUEST',
        'PAID_PROGILE_SUBMIT_SUCCESS',
        'FAILURE'
      ]
    }
  };
};
