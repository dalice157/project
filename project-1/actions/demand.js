import { RSAA } from 'redux-api-middleware';
import { sleep } from '../util/commonUtil';

export const unmountCaseFormData = () => dispatch => dispatch({
  type: 'INITIAL_CASEFORM_DATA',
});

export const updateDemandFormInCaseForm = demandType => dispatch => dispatch({
  type: 'UPDATE_DEMANDFORM_IN_CASEFORM',
  payload: {
    demandType,
  },
});

export const getGigTitleList = topperId => ({
  [RSAA]: {
    endpoint: `/api/demand/gigTitleList/${topperId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      {
        type: 'REQUEST_GIG_TITLE_LIST',
        payload: () => ({ topperId }),
      },
      'GIG_TITLE_LIST_SUCCESS',
      'FAILURE',
    ],
  },
});

export const loadInviteesList = (demandId, filterType, lastKey, isAppendList) => {
  const lastKeyQuery = lastKey || 'initial';
  return {
    [RSAA]: {
      endpoint: `/api/demand/list/invitedTopper/${demandId}/${filterType}/${lastKeyQuery}`,
      method: 'GET',
      credentials: 'include',
      types: (
        isAppendList ? [
          'REQUEST_APPEND_INVITEES_LIST',
          'APPEND_INVITEES_LIST_SUCCESS',
          'FAILURE',
        ]
          : [
            'REQUEST_INVITEES_LIST',
            'LOAD_INVITEES_LIST_SUCCESS',
            'FAILURE',
          ]
      ),
    },
  };
};

export const loadCandidateList = (demandId, filterType, lastKey, isAppendList) => {
  const lastKeyQuery = lastKey || 'initial';
  return {
    [RSAA]: {
      endpoint: `/api/demand/list/quotation/${demandId}/${filterType}/${lastKeyQuery}`,
      method: 'GET',
      credentials: 'include',
      types: (
        isAppendList ? [
          'REQUEST_APPEND_CANDIDATE_LIST',
          'APPEND_CANDIDATE_LIST_SUCCESS',
          'FAILURE',
        ]
          : [
            'REQUEST_CANDIDATE_LIST',
            'LOAD_CANDIDATE_LIST_SUCCESS',
            'FAILURE',
          ]
      ),
    },
  };
};

export const agreeCommunication = (demandId, topperId) => ({
  [RSAA]: {
    endpoint: `/api/demand/receiveApply/${demandId}/${topperId}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      {
        type: 'REQUEST_AGREE_COMMUNICATION',
        payload: () => ({ topperId }),
      },
      'AGREE_COMMUNICATION_SUCCESS',
      'FAILURE',
    ],
  },
});

export const reportCooperation = (demandId, topperId) => ({
  [RSAA]: {
    endpoint: `/api/demand/reportCooperation/${demandId}/${topperId}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      {
        type: 'REQUEST_REPORT_COOPERATION',
        payload: () => ({ topperId }),
      },
      'REPORT_COOPERATION_SUCCESS',
      'FAILURE',
    ],
  },
});

export const confirmCooperation = (demandId, topperId) => ({
  [RSAA]: {
    endpoint: `/api/demand/confirmCooperation/${demandId}/${topperId}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      {
        type: 'REQUEST_CONFIRM_COOPERATION',
        payload: () => ({ topperId }),
      },
      'CONFIRM_COOPERATION_SUCCESS',
      'FAILURE',
    ],
  },
});

export const evaluateTopper = (topperId, gigId, demandBody) => ({
  [RSAA]: {
    endpoint: `/api/demand/writeReview/${topperId}/${gigId}`,
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ demandBody }),
    types: [
      {
        type: 'REQUEST_EVALUATE_TOPPER',
        payload: () => ({ topperId }),
      },
      'EVALUATE_TOPPER_SUCCESS',
      'FAILURE',
    ],
  },
});

// ????????????????????????dealMeta??????????????????????????????dealMeta??????????????????????????????
export const makeUpChatMetaAction = (demandId, topperId) => ({
  [RSAA]: {
    endpoint: `/api/demand/makeUpChatMeta/${demandId}/${topperId}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST_MAKE_UP_CHAT_META',
      'MAKE_UP_CHAT_META_SUCCESS',
      'FAILURE',
    ],
  },
});

export const makeUpChatMeta = (demandId, topperId) => async (dispatch) => {
  const action = await dispatch(makeUpChatMetaAction(demandId, topperId));
  await sleep(2000);
  // ?????? RSAA FAILURE, ?????????reject, ????????????????????????????????????
  return action.error ? Promise.reject(action) : Promise.resolve(action);
};

export const loadDemandTitle = demandId => ({
  [RSAA]: {
    endpoint: `/api/demand/title/${demandId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_DEMAND_TITLE',
      'LOAD_DEMAND_TITLE_SUCCESS',
      'FAILURE',
    ],
  },
});

export const addDemandv2 = demandBody => ({
  [RSAA]: {
    endpoint: '/api/demand/saveDemandV2',
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ demandBody }),
    types: [
      'REQUEST_SAVE_DEMAND',
      'SAVE_DEMAND_SUCCESS',
      'FAILURE_SAVE_DEMAND',
    ],
  },
});

/**
 * ?????????????????? step1 or ???????????? - ??????????????????????????????????????? ?????????????????????
 */
export const getSavedDemand = demandId => ({
  [RSAA]: {
    endpoint: `/api/demand/getSaved/${demandId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_SAVED_DEMAND',
      'LOAD_SAVED_DEMAND_SUCCESS',
      'FAILURE_SAVED_DEMAND',
    ],
  },
});

/**
 * ?????????????????? step2 ???AC????????????????????????????????????????????????
 */
export const getDemanderInfo = demandId => ({
  [RSAA]: {
    endpoint: `/api/demand/getDemanderInfo/${demandId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_LOAD_ACCOUNT_INFO',
      'LOAD_ACCOUNT_INFO_SUCCESS',
      'FAILURE_LOAD_ACCOUNT_INFO',
    ],
  },
});

/**
 * ????????????????????? - ??????????????????
 * @param {*} demandVerifyForm
 */
export const checkDemanderAccount = demandVerifyForm => ({
  [RSAA]: {
    endpoint: '/api/demand/submitDemanderPlan',
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ demandVerifyForm }),
    types: [
      'REQUEST_CHECK_DEMANDER_ACCOUNT',
      'CHECK_DEMANDER_ACCOUNT_SUCCESS',
      'FAILURE_CHECK_DEMANDER_ACCOUNT',
    ],
  },
});

/**
 * ???????????????
 * @param {*} demandId
 * @param {*} demandForm
 */
export const modifyDemandv2 = (demandId, demandBody) => ({
  [RSAA]: {
    endpoint: `/api/demand/saveDemandV2/${demandId}`,
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      demandBody,
    }),
    types: [
      'REQUEST_MODIFY_DEMAND',
      'MODIFY_DEMAND_SUCCESS',
      'FAILURE_MODIFY_DEMAND',
    ],
  },
});

/**
 * ??????????????????????????????
 */
export const getDefaultDemanderForm = () => ({
  [RSAA]: {
    endpoint: '/api/demand/defaultDemanderForm',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_DEFAULT_DEMAND_FORM',
      'LOAD_DEFAULT_DEMAND_FORM',
      'FAILURE_DEFAULT_DEMAND_FORM',
    ],
  },
});

/**
 * ????????????
 */
export const loadDemandList = page => ({
  [RSAA]: {
    endpoint: `/api/demand/list/${page}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_LOAD_DEMAND_LIST',
      'LOAD_DEMAND_LIST_SUCCESS',
      'FAILURE_LOAD_DEMAND_LIST',
    ],
  },
});

/**
 * ???????????? - ????????????
 */
export const filterDemandList = (selectOpt, page) => ({
  [RSAA]: {
    endpoint: `/api/demand/list/${selectOpt}/${page}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_FILTER_DEMAND_LIST',
      'FILTER_DEMAND_LIST_SUCCESS',
      'FAILURE',
    ],
  },
});

/**
 * ??????demander
 * @param {*} demandVerifyForm
 */
export const activateDemandDemander = (demandVerifyForm) => {
  console.log(JSON.stringify(demandVerifyForm));
  return {
    [RSAA]: {
      endpoint: '/api/demand/activateDemander',
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
        'ACTIVATE_DEMAND_DEMANDER_SUCCESS',
        'FAILURE',
      ],
    },
  };
};

/**
 * demand?????????????????????
 * @param {*} demandId
 */
export const demandPaidSubmit = demandId => ({
  [RSAA]: {
    endpoint: `/api/demand/paid/${demandId}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST_PAID_SUBMIT',
      'PAID_SUBMIT_SUCCESS',
      'FAILURE_PAID_SUBMIT',
    ],
  },
});

/**
 * profile?????????????????????
 * @param {*} demandId
 */
export const profilePaidSubmit = (demandId, partBId) => ({
  [RSAA]: {
    endpoint: `/api/profile/${partBId}/paid/${demandId}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST',
      'PAID_SUBMIT_SUCCESS',
      'FAILURE',
    ],
  },
});

/**
 * ????????????
 * @param {*} demandId
 * @param {*} closeReason
 */
export const demandCloseSubmit = (demandId, closeReason, dealPriceList) => ({
  [RSAA]: {
    endpoint: `/api/demand/close/${demandId}/${closeReason}`,
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dealPriceList),
    types: [
      'REQUEST',
      'DEMAND_CLOSE_SUBMIT',
      'FAILURE',
    ],
  },
});


// ?????? - ?????????????????????
export const demandExtendSubmit = demandId => ({
  [RSAA]: {
    endpoint: `/api/demand/extend/${demandId}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST',
      'DEMAND_EXTEND_SUBMIT',
      'FAILURE',
    ],
  },
});

// ???????????????????????????????????????
export const changePhoneDisplay = (demandId, display) => ({
  [RSAA]: {
    endpoint: `/api/demand/phoneDisplay/${demandId}/${display}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST_DEMAND_PHONE_DISPLAY',
      'DEMAND_PHONE_DISPLAY',
      'FAILURE',
    ],
  },
});
