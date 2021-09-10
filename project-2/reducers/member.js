// import sysMsg from '../util/messageUtil.js';
import { message as antdMessage } from 'antd';

const initData = {
  member: {
    basicId: 0,
    pid: '',
    idNo: '',
    acName: '',
    profileName: null,
    identityOrPassport: '',
    invoice: null,
    email: '',
    emailVerifyStatus: false,
    joinDate: '',
    lastLoginDate: null,
    usingService: [],
    gigCount: 0,
    reviewCount: 0,
    demandCount: 0,
    memberType: [],
    isBlackList: false,
  },
  deleteAccountRecord: {
    recordId: 0,
    basicId: 0,
    pid: 0,
    queueType: 0,
    handleStatus: 0,
    acFreeKey: '',
    acStarter: '',
    acStartTime: null,
    acDueTime: null,
    acDirectDel: false,
    createDate: null,
    staffNo: 0,
    modifyDate: null,
    replyAcDate: null,
    acName: '',
    acMainEmail: '',
    lastMemo: {
      createDate: null,
      staff: 0,
      memo: '',
    },
  },
  demanderInfo: {},
  multipleSearchData: {},
  gig: {
    gigId: '',
    // createDate: '',
    // modifyDate: '',
    reviewCount: 0,
    reviewScore: 0.0,
    title: '',
    body: null,
    cats: [],
  },
  topperName: {
    name: '',
  },
  historyList: {
    cursor: null,
    data: [],
    facets: null,
  },
  gigDashboard: {
    publishStatus: null,
    deposit: 'orderTX',
    startDate: null,
    endDate: null,
    publishCount: 0,
    violation: false,
    orderStatus: 2,
    // --- 服務列表 ---
    gigList: null,
    refundPaymentOrderPower: false,
    experienceMemberStartDate: null,
    experienceMemberEndDate: null,
    paymentOrder: null,
    topperDashboard: {
      // --- 合作案件管理 ---
      invitingCount: 0,
      communicatingCount: 0,
      cooperatingCount: 0,
      closedCount: 0,
      // --- 合作案件紀錄 ---
      quotationCount: 0,
      getContactCount: 0,
      demanderInviteCount: 0,
      topSiteCooperateCount: 0,
      oldSiteImportDealCount: 0,
      reviewCount: 0,
    },
    loading: false,
  },
  quotationList: {
    cursor: null,
    data: [],
    facets: null,
  },
  memberData: null,
  invitingList: {
    cursor: null,
    data: [],
    facets: null,
  },
  cooperatingList: {
    cursor: null,
    data: [],
    facets: null,
  },
  titleList: [],
  titleInfo: null,
  closedList: {
    cursor: null,
    data: [],
    facets: null,
  },
  cooperateInfo: null,
  cooperatedList: {
    cursor: null,
    data: [],
    facets: null,
  },
  invitedList: {
    cursor: null,
    data: [],
    facets: null,
  },
  communicatingList: {
    cursor: null,
    data: [],
    facets: null,
  },
  confirmCooperateInfo: null,
  gigContacts: {
    publishRecords: [],
    paymentOrders: [],
    data: [],
    cursor: null,
  },
  singleSearchLoading: false,
  oldSiteInfo: {
    tutorRemainCount: 0,
  },
};
export default function (state = initData, action) {
  switch (action.type) {
    case 'LOAD_MEMBER_MULTIPLE_SEARCH_SUCCESS': {
      antdMessage.success('多條件查詢成功');
      return {
        ...state,
        memberList: action.payload.preCursor ? [...state.memberList, ...action.payload.data] : action.payload.data,
        next: action.payload.cursor,
      };
    }
    case 'REQUEST_SINGLE_MEMBER_SEARCH': {
      return {
        ...state,
        memberList: action.payload,
        singleSearchLoading: true,
      };
    }
    case 'SINGLE_MEMBER_SEARCH_SUCCESS': {
      antdMessage.success('單一條件查詢成功');
      return {
        ...state,
        memberList: action.payload,
        singleSearchLoading: false,
      };
    }
    case 'LOAD_MEMBER_SUCCESS': {
      return {
        ...state,
        memberData: action.payload,
      };
    }
    case 'UPDATE_MEMBER_DATA_SUCCESS': {
      return {
        ...state,
        updateMember: action.payload,
      };
    }
    case 'INSERT_MEMBER_MEMO_SUCCESS': {
      return {
        ...state,
        memberData: {
          ...state.memberData,
          lastMemo: action.payload,
        },
      };
    }
    case 'WRITE_GIG_MEMO_SUCCESS': {
      return {
        ...state,
        memberData: {
          ...state.memberData,
          lastMemo: action.payload,
        },
      };
    }
    case 'LOAD_CANCEL_INFO_SUCCESS': {
      return {
        ...state,
        cancelInfo: action.payload,
      };
    }
    case 'LOAD_DELETE_ACCOUNT_LIST_SUCCESS': {
      return {
        ...state,
        deleteAccountList: action.payload,
      };
    }
    case 'LOAD_DELETE_ACCOUNT_RECORD_SUCCESS': {
      return {
        ...state,
        deleteAccountRecord: action.payload,
      };
    }
    case 'UPDATE_DELETE_ACCOUNT_RECORD_SUCCESS': {
      alert('刪除通知記錄修改成功!');
      window.close();
      window.opener.location.reload();

      return state;
    }
    case 'INSERT_OLDSITE_TOPPER_SUCCESS': {
      return {
        ...state,
        importedPidList: action.payload,
      };
    }
    case 'GENERATE_DEMANDER_BASIC_SUCCESS': {
      return {
        ...state,
        generateDemanderBasic: action.payload,
      };
    }
    case 'LOAD_DEMANDER_INFO_SUCCESS': {
      return {
        ...state,
        demanderInfo: action.payload,
      };
    }
    case 'SINGLE_MEMBER_SEARCH_ISSUES': {
      antdMessage.error('單一條件查詢失敗');
      return {
        ...state,
        singleSearchLoading: false,
      };
    }
    case 'LOAD_MEMBER_MULTIPLE_SEARCH_ISSUES': {
      antdMessage.error('多條件查詢失敗');
      return state;
    }
    case 'STAFF_MANUAL_VERIFY_SUCCESS': {
      antdMessage.success('更新會員驗證狀態成功！');
      const { cellphoneRecord: rtnCellRec, telephoneRecord: rtnTelRec } = action.payload;
      const result = {
        ...state,
        memberData: {
          ...state.memberData,
          topperVerifyForm: {
            ...state.memberData.topperVerifyForm,
            cellphoneRecord: rtnCellRec || state.memberData.topperVerifyForm.cellphoneRecord,
            telephoneRecord: rtnTelRec || state.memberData.topperVerifyForm.telephoneRecord,
          },
          lastMemo: action.payload.memo,
        },
      };

      return result;
    }
    case 'SEND_VERIFY_EMAIL_SUCCESS': {
      antdMessage.success('已發送驗證信。');
      return state;
    }
    case 'GIG_CONTENT_SUCCESS': {
      const gig = action.payload.gigDAO;
      const { fileMap } = action.payload;
      return {
        ...state,
        gig: {
          ...gig,
          fileMap,
        },
      };
    }
    case 'GIG_CONTENT_FAILURE': {
      antdMessage.error('服務載入失敗');
      return state;
    }
    case 'GIG_UPDATE_SUCCESS': {
      return state;
    }
    case 'GIG_UPDATE_FAILURE': {
      antdMessage.error('服務更新失敗');
      return state;
    }
    case 'TOPPER_NAME_SUCCESS': {
      return {
        ...state,
        topperName: action.payload,
      };
    }
    case 'GET_HISTORY_SUCCESS': {
      return {
        ...state,
        historyList: action.payload,
      };
    }
    case 'REQUEST_GIG_DASHBOARD': {
      return {
        ...state,
        gigDashboard: {
          ...state.gigDashboard,
          loading: true,
        },
      };
    }
    case 'GIG_DASHBOARD_SUCCESS': {
      return {
        ...state,
        gigDashboard: {
          ...action.payload,
          loading: false,
        },
      };
    }
    case 'FAILURE_GIG_DASHBOARD': {
      antdMessage.error('接案服務載入失敗');
      return state;
    }
    case 'CHECK_CANCEL_GIG_PUBLISH_SUCCESS': {
      return state;
    }
    case 'CANCEL_GIG_PUBLISH_SUCCESS': {
      antdMessage.success('取消刊登成功');
      return state;
    }
    case 'FAILURE_CANCEL_GIG_PUBLISH': {
      antdMessage.error('取消刊登失敗');
      return state;
    }
    case 'GIG_QUOTATION_SUCCESS': {
      antdMessage.success('主動應徵紀錄載入成功');
      const { payload } = action;
      return {
        ...state,
        quotationList: {
          ...state.quotationList,
          data: payload.preCursor ? [...state.quotationList.data, ...payload.data] : payload.data,
          cursor: payload.cursor,
        },
      };
    }
    case 'FAILURE_GIG_QUOTATION': {
      antdMessage.error('主動應徵紀錄載入失敗');
      return state;
    }
    case 'GIG_INVITING_SUCCESS': {
      const { payload } = action;
      return {
        ...state,
        invitingList: {
          ...state.invitingList,
          data: payload.preCursor ? [...state.invitingList.data, ...payload.data] : payload.data,
          cursor: payload.cursor,
        },
      };
    }
    case 'PUBLISH_RECORD_SUCCESS': {
      return {
        ...state,
        publishRecords: action.payload,
      };
    }
    case 'CONTACT_RECORD_SUCCESS': {
      const { payload } = action;
      return {
        ...state,
        gigContacts: {
          ...state.gigContacts,
          publishRecords: payload.publishRecord,
          paymentOrders: payload.paymentOrder,
        },
      };
    }
    case 'GIG_COOPERATING_SUCCESS': {
      const { payload } = action;
      return {
        ...state,
        cooperatingList: {
          ...state.cooperatingList,
          data: payload.preCursor ? [...state.cooperatingList.data, ...payload.data] : payload.data,
          cursor: payload.cursor,
        },
      };
    }
    case 'GIG_TITLELIST_SUCCESS': {
      return {
        ...state,
        titleList: action.payload,
      };
    }
    case 'SEND_TITLE_INFO_SUCCESS': {
      return {
        ...state,
        titleInfo: action.payload,
      };
    }
    case 'GET_GIG_CONTACTS_SUCCESS': {
      antdMessage.success('查閱案件聯絡資料紀錄載入成功');
      const { payload } = action;
      return {
        ...state,
        gigContacts: {
          ...state.gigContacts,
          data: payload.preCursor ? [...state.gigContacts.data, ...payload.data] : payload.data,
          cursor: payload.cursor,
        },
      };
    }
    case 'FAILURE_GET_GIG_CONTACTS': {
      antdMessage.error('查閱案件聯絡資料紀錄載入失敗');
      return state;
    }

    case 'GIG_CLOSED_SUCCESS': {
      const { payload } = action;
      return {
        ...state,
        closedList: {
          ...state.closedList,
          data: payload.preCursor ? [...state.closedList.data, ...payload.data] : payload.data,
          cursor: payload.cursor,
        },
      };
    }
    case 'SEND_REPORT_COOPERATE_SUCCESS': {
      return {
        ...state,
        cooperateInfo: action.payload,
      };
    }
    case 'COOPERATED_RECORD_SUCCESS': {
      const { payload } = action;
      return {
        ...state,
        cooperatedList: {
          ...state.cooperatedList,
          data: payload.preCursor ? [...state.cooperatedList.data, ...payload.data] : payload.data,
          cursor: payload.cursor,
        },
      };
    }
    case 'INVITED_RECORD_SUCCESS': {
      antdMessage.success('案主邀請紀錄載入成功');
      const { payload } = action;
      return {
        ...state,
        invitedList: {
          ...state.invitedList,
          data: payload.preCursor ? [...state.invitedList.data, ...payload.data] : payload.data,
          cursor: payload.cursor,
        },
      };
    }
    case 'FAILURE_INVITED_RECORD': {
      antdMessage.error('案主邀請紀錄載入失敗');
      return state;
    }
    case 'COMMUNICATING_SUCCESS': {
      const { payload } = action;
      return {
        ...state,
        communicatingList: {
          ...state.communicatingList,
          data: payload.preCursor ? [...state.communicatingList.data, ...payload.data] : payload.data,
          cursor: payload.cursor,
        },
      };
    }
    case 'SEND_CONFIRM_COOPERATE_SUCCESS': {
      return {
        ...state,
        confirmCooperateInfo: action.payload,
      };
    }
    case 'SUCCESS_GET_OLDSITE_INFO':
    case 'SUCCESS_SYNC_TUTOR_INFO': {
      return {
        ...state,
        oldSiteInfo: action.payload,
      };
    }
    default:
      return state;
  }
}
