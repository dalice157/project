import { message, notification } from 'antd';
import sysMsg from '../util/messageUtil.js';

const initState = {
  listContact: {
    data: [],
    cursor: null,
  },
  listQuotation: {
    data: [],
    cursor: null,
  },
  listClosed: {
    data: [],
    cursor: null,
  },
  listCooperating: {
    data: [],
    cursor: null,
  },
  isCheckPublish: true,
  reportCooperationData: {},
  confirmCooperationData: {},
  titleLists: [],
  askReview: {},
  contactData: {
    demandBody: {},
    demandContact: {},
  },
  reviewData: {},
  profileData: {},
  gigDashboard: {
    topperDashboard: {},
    trialPlan: {},
    isLoading: true,
  },
  blockInfo: {
    topperName: '-',
    reviewAvgScore: 5.0,
    visitCount: 0,
    dealCount: 0,
    medal: '0',
    activeInSevenDays: 'false',
    isLoading: true,
  },
  dealLists: {},
  invitingList: {
    data: [],
  },
  communicatingList: {
    data: [],
  },
  paidRecord: {
    data: [],
    isLoading: true,
  },
};

const manageReducer = (state = initState, action) => {
  switch (action.type) {
    case 'GET_WATCH_DEAL_LIST_SUCCESS': {
      return {
        ...state,
        dealLists: action.payload,
      };
    }
    case 'GET_LIST_CONTACT_SUCCESS': {
      const { payload } = action;
      return {
        ...state,
        listContact: {
          ...state.listContact,
          data: payload.preCursor ? [...state.listContact.data, ...payload.data] : payload.data,
          cursor: payload.cursor,
        },
      };
    }
    case 'CHECK_PUBLISH_SUCCESS': {
      return {
        ...state,
        isCheckPublish: action.payload,
      };
    }
    case 'REPORT_COOPERTATION_SUCCESS': {
      message.success('已成功回報合作');
      return {
        ...state,
        reportCooperationData: action.payload,
      };
    }
    case 'REPORT_COOPERTATION_FAILURE': {
      sysMsg(action, true);
      return state;
    }
    case 'CONFIRM_COOPERTATION_SUCCESS': {
      message.success('已成功確認合作');
      return {
        ...state,
        confirmCooperationData: action.payload,
      };
    }
    case 'CONFIRM_COOPERTATION_FAILURE': {
      sysMsg(action, true);
      return state;
    }
    case 'GET_TITLE_LIST_SUCCESS': {
      return {
        ...state,
        titleLists: action.payload,
      };
    }
    case 'SEND_ASK_REVIEW_SUCCESS': {
      notification.success({
        duration: 2,
        message: '已完成邀請評價',
        description:
          '系統將會發送通知給案主，提醒案主給您評價。',
      });
      return {
        ...state,
        askReview: action.payload,
      };
    }
    case 'SEND_ASK_REVIEW_FAILURE': {
      sysMsg(action, true);
      return state;
    }
    case 'LOAD_GET_CONTACT_SUCCESS': {
      return {
        ...state,
        contactData: action.payload,
      };
    }
    case 'GET_REVIEW_SUCCESS': {
      return {
        ...state,
        reviewData: action.payload,
      };
    }
    case 'GET_CONTACT_SUCCESS': {
      return {
        ...state,
        profileData: action.payload,
      };
    }
    case 'LOAD_GIG_DASHBOARD': {
      return {
        ...state,
        gigDashboard: {
          ...action.payload,
          isLoading: false,
        },
      };
    }
    case 'LOAD_TOPPER_BLOCKINFO': {
      return {
        ...state,
        blockInfo: {
          ...action.payload,
          isLoading: false,
        },
      };
    }
    case 'GET_LIST_QUOTATION_SUCCESS': {
      const { payload } = action;
      return {
        ...state,
        listQuotation: {
          ...state.listQuotation,
          data: payload.preCursor ? [...state.listQuotation.data, ...payload.data] : payload.data,
          cursor: payload.cursor,
        },
      };
    }
    case 'LOAD_INVITING_LIST': {
      return {
        ...state,
        invitingList: action.payload,
      };
    }
    case 'LOAD_COMMUNICATING_LIST': {
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
    case 'GET_LIST_CLOSED_SUCCESS': {
      const { payload } = action;
      return {
        ...state,
        listClosed: {
          ...state.listClosed,
          data: payload.preCursor ? [...state.listClosed.data, ...payload.data] : payload.data,
          cursor: payload.cursor,
        },
      };
    }
    case 'GET_LIST_COOPERATING_SUCCESS': {
      const { payload } = action;
      return {
        ...state,
        listCooperating: {
          ...state.listCooperating,
          data: payload.preCursor ? [...state.listCooperating.data, ...payload.data] : payload.data,
          cursor: payload.cursor,
        },
      };
    }
    case 'GET_PAID_RECORD_SUCCESS': {
      message.success('載入付款紀錄成功');
      return {
        ...state,
        paidRecord: {
          data: action.payload,
          isLoading: false,
        },
      };
    }
    default:
      return state;
  }
};

export default manageReducer;
