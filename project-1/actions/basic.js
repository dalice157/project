import { RSAA } from 'redux-api-middleware';

export const loadTestUser = () => ({
  [RSAA]: {
    endpoint: '/api/basic/testAccount',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_TEST_USER',
      'LOAD_TEST_USER',
      'FAILURE',
    ],
  },
});

export const loadUserInfo = () => ({
  [RSAA]: {
    endpoint: '/api/getInfo',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_USER_INFO',
      'LOAD_USER_INFO_SUCCESS',
      'LOAD_USER_INFO_ISSUES',
    ],
  },
});

export const getDemandOrder = orderId => ({
  [RSAA]: {
    endpoint: `/api/getDemandOrder/${orderId}`,
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_DEMAND_ORDER',
      'LOAD_DEMAND_ORDER_SUCCESS',
      'FAILURE',
    ],
  },
});

export const loadDefaultProfile = () => ({
  [RSAA]: {
    endpoint: '/api/basic/defaultProfile',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_DEAFULT_PROFILE_SUCCESS',
      'FAILURE',
    ],
  },
});

export const loadGigs = () => ({
  [RSAA]: {
    endpoint: '/api/basic/gig',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_GIGS_SUCCESS',
      'FAILURE',
    ],
  },
});

/**
 * 新增/更新會員 GIGs
 * @param {object[]} gigs imPk
 */
export const saveGigs = (gigs, _csrf) => ({
  [RSAA]: {
    endpoint: '/api/basic/gig',
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'xsrf-token': _csrf },
    body: JSON.stringify({ gigs }),
    types: [
      'REQUEST',
      'SAVE_GIGS_SUCCESS',
      'FAILURE',
    ],
  },
});
export const deleteGig = gigId => ({
  [RSAA]: {
    endpoint: `/api/basic/gig/${gigId}`,
    method: 'DELETE',
    credentials: 'include',
    types: [
      'REQUEST',
      'DELETE_GIG_SUCCESS',
      'FAILURE',
    ],
  },
});

export const loadImportSourceList = () => ({
  [RSAA]: {
    endpoint: '/api/basic/import/sourceList',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_IMPORT_SOURCE_LIST_SUCCESS',
      'LOAD_IMPORT_SOURCE_LIST_INFO_ISSUES',
    ],
  },
});

export const loadCaseDeal = () => ({
  [RSAA]: {
    endpoint: '/api/basic/info/deal',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'LOAD_CASE_DEAL_SUCCESS',
      'FAILURE',
    ],
  },
});

export const importTopperProfile = source => ({
  [RSAA]: {
    endpoint: `/api/basic/importTopperProfile/${source}`,
    method: 'POST',
    credentials: 'include',
    types: [
      'REQUEST',
      'IMPORT_PROFILE_SUCCESS',
      'FAILURE',
    ],
  },
});

export const publish = () => ({
  [RSAA]: {
    endpoint: '/api/basic/publish',
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST',
      'BASIC_PUBLISH_SUCCESS',
      'FAILURE',
    ],
  },
});

// 取消刊登-Step1.取消刊登品牌頁
export const getCancel = () => ({
  [RSAA]: {
    endpoint: '/api/basic/getCancel',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'BASIC_GET_CANCEL',
      'FAILURE',
    ],
  },
});
// 取消刊登-Step2.取消刊登並申退保證金
export const cancel = (reasonOpt, reason, cancelSubscription) => ({
  [RSAA]: {
    endpoint: `/api/basic/cancel?reasonOpt=${reasonOpt}&reason=${reason}&cancelSubscription=${cancelSubscription}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST',
      'BASIC_PUT_CANCEL',
      'FAILURE',
    ],
  },
});

// 取消刊登-Step3.繼續公開/取消公開 CProfile的資料
export const setPlusPublishStatus = act => ({
  [RSAA]: {
    endpoint: `/api/basic/plusPublish/${act}`,
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST',
      'BASIC_SET_PLUS_PUBLISH_STATUS',
      'FAILURE',
    ],
  },
});

// 確認 已付保證金但未公開plus 狀態
export const getPlusShare = () => ({
  [RSAA]: {
    endpoint: '/api/basic/plusShare',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'BASIC_GET_PLUS_SHARE',
      'FAILURE',
    ],
  },
});

// 聊天室未讀訊息
export const getImUnread = () => ({
  [RSAA]: {
    endpoint: '/api/basic/im/unread',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST_GET_IM_UNREAD',
      'BASIC_GET_IM_UNREAD',
      'FAILURE',
    ],
  },
});

// 接案者 - 新手體驗方案
export const chargeTopperFree = inputActiveTopperForm => ({
  [RSAA]: {
    endpoint: '/api/basic/chargeTopperFree',
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputActiveTopperForm),
    types: [
      'REQUEST',
      'BASIC_CHARGE_TOPPER_FREE',
      'FAILURE',
    ],
  },
});

export const yolkMemberBeenToEdit = () => ({
  [RSAA]: {
    endpoint: '/api/basic/yolkmember/beenEdit',
    method: 'PUT',
    credentials: 'include',
    types: [
      'REQUEST',
      'BASIC_YOLK_MEMBER_BEEN_TO_EDIT',
      'FAILURE',
    ],
  },
});

// 個人檔案 發布檢查
export const getPublishCheck = () => ({
  [RSAA]: {
    endpoint: '/api/basic/publish/check',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'BASIC_GET_PUBLISH_CHECK',
      'FAILURE',
    ],
  },
});

// 取得高手產品啟用頁的預設資訊
export const getFormDefault = () => ({
  [RSAA]: {
    endpoint: '/api/basic/form/default',
    method: 'GET',
    credentials: 'include',
    types: [
      'REQUEST',
      'BASIC_GET_FORM_DEFAULT',
      'FAILURE',
    ],
  },
});

// 啟用 104高手 產品
export const saveTopForm = inputTopForm => ({
  [RSAA]: {
    endpoint: '/api/basic/active',
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputTopForm,
    }),
    types: [
      'REQUEST',
      'SAVE_TOP_FORM_SUCCESS',
      'FAILURE',
    ],
  },
});

// 選擇付費方案前，取得會員的折扣資訊、預設的發票資訊
export const getPayInfoV2 = () => ({
  [RSAA]: {
    endpoint: '/api/basic/payment/prePaymentInfo/v2',
    method: 'GET',
    credentials: 'include',
    types: [
      'BASIC_GET_PAY_INFO_REQUEST_V2',
      'BASIC_GET_PAY_INFO_V2',
      'BASIC_GET_PAY_INFO_FAILURE_V2',
    ],
  },
});

// 付費超值方案升級，取得差額及可升級的方案
export const getPreUpgradePlanInfo = () => ({
  [RSAA]: {
    endpoint: '/api/basic/payment/preUpgradePlanInfo',
    method: 'GET',
    credentials: 'include',
    types: [
      'PRE_UPGRADE_PLAN_INFO_REQUEST',
      'PRE_UPGRADE_PLAN_INFO_SUCCESS',
      'PRE_UPGRADE_PLAN_INFO_FAILURE',
    ],
  },
});

// 建立高手訂單、MIS訂單
export const sendPaymentOrder = dto => ({
  [RSAA]: {
    endpoint: '/api/basic/payment/createPaymentOrder',
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
    types: [
      'REQUEST',
      'SEND_PAYMENT_ORDER_SUCCESS',
      'SEND_PAYMENT_ORDER_FAILURE',
    ],
  },
});

// 建立高手升級方案訂單、MIS訂單
export const sendUpgradeOrder = dto => ({
  [RSAA]: {
    endpoint: '/api/basic/payment/createUpgradeOrder',
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
    types: [
      'SEND_UPGRADE_ORDER_REQUEST',
      'SEND_UPGRADE_ORDER_SUCCESS',
      'SEND_UPGRADE_ORDER_FAILURE',
    ],
  },
});


// 付費刊期訂單 - MIS付款流程完成後的交易處理
export const sendPaymentOrderReceiver = (payResult, _csrf) => ({
  [RSAA]: {
    endpoint: '/api/basic/payment/paymentOrderReceiver',
    method: 'put',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'xsrf-token': _csrf,
    },
    body: JSON.stringify(payResult),
    types: [
      'REQUEST',
      'SEND_PAYMENT_ORDER_RECEIVER_SUCCESS',
      'SEND_PAYMENT_ORDER_RECEIVER_FAILURE',
    ],
  },
});

// 三聯式發票確認
export const checkInvoice = payload => ({
  [RSAA]: {
    endpoint: '/api/basic/payment/check/bmdm',
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    types: [
      'REQUEST_CHECK_INVOICE',
      'CHECK_INVOICE_SUCCESS',
      'CHECK_INVOICE_FAILURE',
    ],
  },
});


// 確認使用中的訂單資訊，與預購的訂單
export const getPaidRecordUsing = () => ({
  [RSAA]: {
    endpoint: '/api/basic/payment/paidRecord/using',
    method: 'GET',
    credentials: 'include',
    types: [
      'GET_PAID_RECORD_USING_REQUEST',
      'GET_PAID_RECORD_USING',
      'GET_PAID_RECORD_USING_FAILURE',
    ],
  },
});


// 取得 1.體驗 2.超值 3.無限 三個方案可接的上線中案件數
export const getAvailableOnDemands = () => ({
  [RSAA]: {
    endpoint: '/api/basic/payment/availableOnDemands',
    method: 'GET',
    credentials: 'include',
    types: [
      'GET_AVAILABLE_ON_DEMANDS_REQUEST',
      'GET_AVAILABLE_ON_DEMANDS_SUCCESS',
      'GET_AVAILABLE_ON_DEMANDS_FAILURE',
    ],
  },
});
