import { RSAA } from 'redux-api-middleware';
import { sleep } from '../util/commonUtil';

// 我要應徵
export const addApplier = (basicId, demandId, gigId) => {
  return {
    [RSAA]: {
      endpoint: '/api/case/add/' + basicId + '/' + demandId + '/applier?gigId=' + gigId,
      method: 'PUT',
      credentials: 'include',
      types: [
        'REQUEST',
        'ADD_APPLIER_SUBMIT_SUCCESS',
        'ADD_APPLIER_SUBMIT_FAILURE'
      ]
    }
  };
};

// 主應後 取得可用權益
export const loadBargainingPower = (demandId) => {
  return {
    [RSAA]: {
      endpoint: '/api/case/bargainingPower/' + demandId,
      method: 'GET',
      credentials: 'include',
      types: [
        'LOAD_BARGAINING_POWER_REQUEST',
        'LOAD_BARGAINING_POWER_SUCCESS',
        'LOAD_BARGAINING_POWER_FAILURE'
      ]
    }
  };
};

// 主應後 主應後 取得聯絡方式
const doGetContactsAction = (demandId, useIm) => {
  return {
    [RSAA]: {
      endpoint: `/api/case/getContacts?demandId=${demandId}&useIm=${useIm}`,
      method: 'PUT',
      credentials: 'include',
      types: [
        'GET_CONTACTS_REQUEST',
        'GET_CONTACTS_SUCCESS',
        'GET_CONTACTS_FAILURE'
      ]
    }
  };
};

export const doGetContacts = (demandId, useIm) => {
  return async (dispatch) => {
    const action = await dispatch(doGetContactsAction(demandId, useIm));
    if (useIm) {
      await sleep(2000);
    }
    // 因為 RSAA FAILURE, 不會跑reject, 所以用非同步方法把他分開
    return action.error ? Promise.reject(action) : Promise.resolve(action);
  };
};


// 產生沒有聊天室的dealMeta之後的補償，目前僅補dealMeta在邀請及溝通中的情況
export const makeUpChatMetaAction = (demandId) => {
  return {
    [RSAA]: {
      endpoint: `/api/case/makeUpChatMeta?demandId=${demandId}`,
      method: 'PUT',
      credentials: 'include',
      types: [
        'REQUEST',
        'MAKE_UP_CHAT_META_SUCCESS',
        'MAKE_UP_CHAT_META_FAILURE'
      ]
    }
  };
};

export const makeUpChatMeta = (demandId) => {
  return async (dispatch) => {
    const action = await dispatch(makeUpChatMetaAction(demandId));
    await sleep(2000);
    // 因為 RSAA FAILURE, 不會跑reject, 所以用非同步方法把他分開
    return action.error ? Promise.reject(action) : Promise.resolve(action);
  };
};

export const getGigData = (demandId) => {
  return {
    [RSAA]: {
      endpoint: `/api/case/gig?demandId=${demandId}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST',
        'LOAD_GIG_DATA',
        'LOAD_GIG_DATA_FAILURE'
      ]
    }
  };
};
