import { message } from 'antd';
import sysMsg from '../util/messageUtil.js';
import * as chatmetaUtil from '../util/chatmetaUtil';
import { CHAT_MOBILE_PAGE } from '../config/constant';
/**
 * demanderMenu smaple
 * [{
 *  demandId: '',
 *  title: '',
 *  status: '',
 *  createDate: '',
 * }]
 */
const initState = {
  demanderMenu: [],
  demanderChatmeta: {
    demandId: '',
    demandTitle: '',
    totalTopper: 0,
    list: [
      // {
      //   tooperId: 0,
      //   deskDemand: {},
      //   chatMetaId: '',
      //   topperImg: '',
      //   topperName: '',
      //   totalMessage: 0
      // }
    ],
    nextKey: null
  },
  // forTopper: {
  //   totalDemander: 0,
  //   processing: [],
  //   inviting: []
  // },
  topperChatmeta: {
    totalDemander: 0,
    list: [],
    processing: [],
    inviting: []
  },
  deskDemand: {
    chatMetaStatus: null,
    deskItem: [],
  },
  joinChannel: {},
  invite: {},
  imEvent: {},
  gigs: [],
  survey: {},
  askReview: {},
  review: {},
  unInviteDemands: [],
  unConfirmDemands: [],
  saveDemand: {
    data: {
      demandId: '',
      basicId: '',
    },
    id: null,
    message: '',
    success: false,
  },
  defaultDemanderForm: {
    cellphoneRecord: {
      basicId: 0,
      cellphone: '',
      certificate: false,
      frequency: 0,
    },
    emailInfo: {
      email: '',
      isMain: '',
      isVerified: '',
    },
    firstName: '',
    familyName: '',
    sex: '',
    identityType: null,
    identity: '',
    invoice: null,
    email: '',
    telArea: '',
    tel: '',
  },
  activate: {},
  paid: null,
  demandContactInfo: {
    isProvide: false,
    demandContact: {
      name: '',
      sex: '1',
      telArea: '',
      tel: '',
      displayTel: false,
      cellphone: '',
      displayCellphone: false,
      email: '',
      other: '',
      displayOther: false,
      demandTitle: ''
    }
  },
  imUnread: {
    topperUnReadMsgCount: 0,
    demanderUnReadMsgCount: 0,
  },
  role: [],
  isChatLoading: true,
  currentTab: chatmetaUtil.ROLE.TOPPER,
  topperMeta: { topperId: '', roomId: '' }, // 我的高手
  demanderMeta: { demanderId: '', roomId: '' }, // 我的案主
  roomId: '',
  isLoadingNewMessage: false, // 載入新訊息中，更新訊息用
  isLoadingInitialMessages: false, // 載入新訊息中
  messages: [], // 聊天訊息
  chatStatus: '',
  isOtherSexualHarassment: 'false',

  // 高手
  selectedDemanderId: '',

  selectedDemandId: '-1',
  selectTopperId: '',
  // 手機版
  mobilePageType: CHAT_MOBILE_PAGE.chatlist,
  showMyTopperTabDot: 0,
  showMyDemanderTabDot: 0,
  memberList: [],
  lastReadMessagesIndex: 0,
  isUpdatingMessage: false,
  isInitializedChatRole: false,
  isUploadingFile: false,
  hasInitialTwilio: false,
};

function readCount(imUnread, roomId) {
  return imUnread && imUnread.unreadMap ? imUnread.unreadMap[roomId] : 0;
}

const chatmetaReducer = (state = initState, action) => {
  switch (action.type) {
    case 'UNMOUNT_TWILIO': {
      const {
        mobilePageType, hasInitialTwilio, demanderChatmeta, topperChatmeta, isInitializedChatRole, isChatLoading
      } = action.payload;
      return {
        ...state,
        mobilePageType: mobilePageType,
        hasInitialTwilio: hasInitialTwilio,
        isChatLoading: isChatLoading,
        isInitializedChatRole: isInitializedChatRole,
        demanderChatmeta: demanderChatmeta,
        topperChatmeta: topperChatmeta,
      };
    }
    case 'HANDLE_SYSTEM_MESSAGES': {
      const { chatStatus } = action.payload;
      return {
        ...state,
        chatStatus: chatStatus,
      };
    }
    case 'INITIAL_TWILIO': {
      return {
        ...state,
        hasInitialTwilio: true,
      };
    }
    case 'REQUEST_UPLOAD_FILE': {
      return {
        ...state,
        isUploadingFile: true,
      };
    }
    case 'UPLOAD_FILE_FAILURE':
    case 'UPLOAD_FILE_SUCCESS': {
      return {
        ...state,
        isUploadingFile: false,
      };
    }
    case 'UPDATE_CHATLIST_TABDOT': {
      const { imUnread } = state;
      const { topperUnReadMsgCount, demanderUnReadMsgCount } = action.payload;
      return {
        ...state,
        imUnread: {
          ...imUnread,
          topperUnReadMsgCount: topperUnReadMsgCount,
          demanderUnReadMsgCount: demanderUnReadMsgCount,
        },
      };
    }
    case 'UPDATE_READ_MESSAGE': {
      const { selectedDemanderId, selectTopperId, currentTab } = state;
      const { memberList, isLoadingNewMessage } = action.payload;
      const isEachMemberNotLeave = memberList.length === 2;
      if (isEachMemberNotLeave) {
        if (currentTab === chatmetaUtil.ROLE.DEMANDER) {
          // 我的高手
          const topperDataIndex = memberList.findIndex(member => member.identity == selectTopperId);
          return {
            ...state,
            memberList: memberList,
            isLoadingNewMessage: isLoadingNewMessage,
            lastReadMessagesIndex: memberList[topperDataIndex] ? memberList[topperDataIndex].lastConsumedMessageIndex : 0,
          };
        } else {
          // 我的案主
          const demanderDataIndex = memberList.findIndex(member => member.identity == selectedDemanderId);
          return {
            ...state,
            memberList: memberList,
            isLoadingNewMessage: isLoadingNewMessage,
            lastReadMessagesIndex: memberList[demanderDataIndex] ? memberList[demanderDataIndex].lastConsumedMessageIndex : 0,
          };
        }
      } else {
        // 已退出聊天室
        return {
          ...state,
          memberList: memberList,
          isLoadingNewMessage: isLoadingNewMessage,
          lastReadMessagesIndex: 0,
        };
      }
    }
    case 'DEMAND_CHANGE': {
      const { selectedDemandId } = action.payload;
      return {
        ...state,
        selectedDemandId: selectedDemandId,
      };
    }
    case 'UPDATE_MESSAGE': {
      const {
        messages, isLoadingInitialMessages, isLoadingNewMessage
      } = action.payload;
      return {
        ...state,
        messages: messages,
        isLoadingInitialMessages: isLoadingInitialMessages,
        isLoadingNewMessage: isLoadingNewMessage,
      };
    }
    case 'CLEAN_CHATROOM': {
      const {
        roomId, messages, topperMeta, demanderMeta, selectedDemanderId, selectTopperId, isLoadingInitialMessages, chatStatus
      } = action.payload;
      return {
        ...state,
        roomId: roomId,
        messages: messages,
        topperMeta: topperMeta,
        demanderMeta: demanderMeta,
        selectedDemanderId: selectedDemanderId,
        selectTopperId: selectTopperId,
        isLoadingInitialMessages: isLoadingInitialMessages,
        chatStatus: chatStatus,
      };
    }
    case 'CHANGE_CHAT_TAB': {
      const { imUnread } = state;
      const { topperUnReadMsgCount, demanderUnReadMsgCount } = imUnread;
      const {
        currentTab, isLoadingInitialMessages, messages, roomId, memberList, isLoadingNewMessage
      } = action.payload;
      return {
        ...state,
        currentTab: currentTab,
        isLoadingInitialMessages: isLoadingInitialMessages,
        isLoadingNewMessage: isLoadingNewMessage,
        messages: messages,
        roomId: roomId,
        memberList: memberList,
        imUnread: {
          ...imUnread,
          topperUnReadMsgCount: currentTab === chatmetaUtil.ROLE.TOPPER ? 0 : topperUnReadMsgCount,
          demanderUnReadMsgCount: currentTab === chatmetaUtil.ROLE.DEMANDER ? 0 : demanderUnReadMsgCount,
        },
      };
    }
    case 'CHANGE_MOBILE_CHAT_PAGE': {
      const { mobilePageType, isLoadingNewMessage } = action.payload;
      return {
        ...state,
        mobilePageType: mobilePageType,
        isLoadingNewMessage: isLoadingNewMessage,
      };
    }
    case 'SELECT_DEMAND_DROPDOWN': {
      const { selectedDemandId, selectTopperId } = action.payload;
      return {
        ...state,
        selectedDemandId: selectedDemandId,
        selectTopperId: selectTopperId,
      };
    }
    case 'UPDATE_NEW_MESSAGE': {
      const { messages, isLoadingNewMessage } = action.payload;
      return {
        ...state,
        messages: messages,
        isLoadingNewMessage: isLoadingNewMessage,
      };
    }
    case 'SEND_NEW_MESSAGE': {
      const { isLoadingNewMessage } = action.payload;
      return {
        ...state,
        isLoadingNewMessage: isLoadingNewMessage,
      };
    }
    case 'TOPPER_CLICK': {
      const {
        messages, roomId, selectTopperId, chatStatus, topperMeta, isLoadingNewMessage
      } = action.payload;
      return {
        ...state,
        roomId: roomId,
        selectTopperId: selectTopperId,
        chatStatus: chatStatus,
        messages: messages,
        topperMeta: topperMeta,
        isLoadingNewMessage: isLoadingNewMessage,
      };
    }
    case 'UPDATE_ACTIVE_PAGE_SUCCESS': {
      const { messages, isUpdatingMessage, isLoadingNewMessage } = action.payload;
      return {
        ...state,
        messages: messages,
        isUpdatingMessage: isUpdatingMessage,
        isLoadingNewMessage: isLoadingNewMessage,
      };
    }
    case 'DEMANDER_CLICK': {
      const {
        messages, roomId, selectedDemanderId, chatStatus, demanderMeta, isLoadingNewMessage
      } = action.payload;
      return {
        ...state,
        roomId: roomId,
        selectedDemanderId: selectedDemanderId,
        chatStatus: chatStatus,
        messages: messages,
        demanderMeta: demanderMeta,
        isLoadingNewMessage: isLoadingNewMessage,
      };
    }
    case 'CHOOSE_TOPPER': {
      const {
        roomId, selectTopperId, isLoadingNewMessage, chatStatus, topperMeta
      } = action.payload;
      return {
        ...state,
        roomId: roomId,
        selectTopperId: selectTopperId,
        isLoadingNewMessage: isLoadingNewMessage,
        chatStatus: chatStatus,
        topperMeta: topperMeta,
      };
    }
    case 'INITIAL_CHATROLE': {
      const {
        selectedDemanderId, selectedDemandId, selectTopperId, currentTab, role, isInitializedChatRole
      } = action.payload;
      return {
        ...state,
        role: role,
        isChatLoading: false,
        currentTab: currentTab,
        selectedDemanderId: selectedDemanderId,
        selectedDemandId: selectedDemandId,
        selectTopperId: selectTopperId,
        isInitializedChatRole: isInitializedChatRole,
      };
    }
    case 'CHOOSE_DEMANDER': {
      const {
        roomId, selectedDemanderId, isLoadingNewMessage, chatStatus, demanderMeta
      } = action.payload;
      return {
        ...state,
        roomId: roomId,
        selectedDemanderId: selectedDemanderId,
        isLoadingNewMessage: isLoadingNewMessage,
        chatStatus: chatStatus,
        demanderMeta: demanderMeta,
      };
    }
    case 'REQUEST_INITIAL_MESSAGES': {
      const { isLoadingInitialMessages } = action.payload;
      return {
        ...state,
        isLoadingInitialMessages: isLoadingInitialMessages,
      };
    }
    case 'LOAD_DEMANDER_MENU_SUCCESS': {
      return {
        ...state,
        demanderMenu: action.payload || state.demanderMenu,
        // topperChatmeta: initState.topperChatmeta,
      };
    }
    case 'BASIC_GET_IM_UNREAD': { // 未讀訊息的統計
      const imUnread = action.payload.data;
      const list = state.demanderChatmeta && state.demanderChatmeta.list ? state.demanderChatmeta.list.map(item => ({
        ...item,
        totalMessage: imUnread ? readCount(imUnread, item.roomId) : 0,
      })) : [];

      const inviting = state.demanderChatmeta && state.topperChatmeta.list ? state.topperChatmeta.list.map(item => ({
        ...item,
        totalMessage: imUnread ? readCount(imUnread, item.roomId) : 0
      })) : [];
      return {
        ...state,
        imUnread,
        demanderChatmeta: {
          ...state.demanderChatmeta,
          list: list
        },
        topperChatmeta: {
          ...state.topperChatmeta,
          list: inviting
        }
      };
    }
    case 'LOAD_DEMANDER_CASE_CHATMETA_SUCCESS': {
      const imUnread = state.imUnread;
      const convertList = action.payload.data.map(item => ({
        topperId: String(item.topperId),
        deskDemand: {},
        roomId: item.id,
        topperImg: item.topperImg,
        topperName: item.topperName,
        demandCnt: item.demandList.length,
        demandStep: item.demandStep,
        demandList: item.demandList,
        demandTitleList: item.demandTitleList,
        status: item.status,
        totalMessage: item.messageCnt || (imUnread ? readCount(imUnread, item.id) : 0),
        publishing: item.publishing,
      }));
      const payloadList = action.payload.preCursor ? [...state.demanderChatmeta.list, ...convertList] : convertList;
      return {
        ...state,
        demanderChatmeta: {
          ...state.demanderChatmeta,
          list: payloadList,
          nextKey: action.payload.cursor
        }
        // topperChatmeta: initState.topperChatmeta,
      };
    }
    case 'LOAD_DESK_DEMAND_SUCCESS': {
      return {
        ...state,
        deskDemand: action.payload
      };
    }
    case 'LOAD_TOPPER_CHATMETA_SUCCESS_V2': {
      const imUnread = state.imUnread;
      const convertList = action.payload.data ? action.payload.data.map(item => ({
        topperId: String(item.topperId),
        demanderId: String(item.demanderId),
        deskDemand: {},
        roomId: item.id,
        demanderName: item.demanderName,
        demandStep: item.demandStep,
        demandList: item.demandList,
        demandTitleList: item.demandTitleList,
        status: item.status,
        totalMessage: item.messageCnt || (imUnread ? readCount(imUnread, item.id) : 0)
      })) : [];

      // const inviting = action.payload.inviting.map(item => ({
      //   ...item,
      //   totalMessage: imUnread ? readCount(imUnread, item.roomId) : 0
      // }));
      // const processing = action.payload.processing.map(item => ({
      //   ...item,
      //   totalMessage: imUnread ? readCount(imUnread, item.roomId) : 0
      // }));
      const payloadList = action.payload.preCursor ? [...state.topperChatmeta.list, ...convertList] : convertList;
      return {
        ...state,
        topperChatmeta: {
          totalDemander: convertList.length,
          list: payloadList,
          nextKey: action.payload.cursor
        }
        // forTopper: action.payload,
        // demanderMenu: initState.demanderMenu,
        // demanderChatmeta: initState.demanderChatmeta,
      };
    }

    case 'UPDATE_MESSAGE_COUNT_SUCCESS': {
      return {
        ...state,
        ...action.payload
      };
    }

    case 'UPDATE_MESSAGE_UNREAD_COUNT_SUCCESS': {
      const { roomId, unReadCount } = action.payload;
      const imUnread = state.imUnread;
      const unreadMap = imUnread ? {
        ...imUnread.unreadMap
      } : {};
      unreadMap[roomId] = unReadCount;
      const list = state.demanderChatmeta.list.map(item => (item.roomId === roomId ? {
        ...item,
        totalMessage: unReadCount,
      } : item));
      const inviting = state.topperChatmeta.list.map(item => (item.roomId === roomId ? {
        ...item,
        totalMessage: unReadCount,
      } : item));
      return {
        ...state,
        imUnread: {
          ...imUnread,
          unreadMap: unreadMap
        },
        demanderChatmeta: {
          ...state.demanderChatmeta,
          list: list
        },
        topperChatmeta: {
          ...state.topperChatmeta,
          list: inviting
        }
      };
    }

    case 'JOIN_CHANNEL_SUCCESS': {
      return {
        ...state,
        joinChannel: action.payload
      };
    }

    case 'INVITE_CHAT_SUCCESS': {
      return {
        ...state,
        invite: action.payload
      };
    }

    case 'INVITE_CHAT_FAILURE': {
      sysMsg(action, true);
      return state;
    }

    case 'ACCEPT_CHAT_SUCCESS': {
      return {
        ...state,
        accept: action.payload
      };
    }

    case 'ASK_CONFIRM_CHAT_SUCCESS': {
      return {
        ...state,
        askConfirm: action.payload
      };
    }

    case 'CONFIRM_CHAT_SUCCESS': {
      return {
        ...state,
        confirm: action.payload
      };
    }

    case 'UNCONFIRM_CHAT_SUCCESS': {
      return {
        ...state,
        unConfirm: action.payload
      };
    }

    case 'REJECT_CHAT_SUCCESS': {
      return {
        ...state,
        reject: action.payload
      };
    }

    case 'SAVE_DEMANDER_SURVEY_SUCCESS': {
      return {
        ...state,
        survey: action.payload
      };
    }

    case 'LOAD_GIGS_SUCCESS': {
      return {
        ...state,
        gigs: action.payload
      };
    }

    case 'ASK_REVIEW_SUCCESS': {
      const demandId = action.payload.data.dealMeta.demandId;
      const requireReviewDate = action.payload.data.dealMeta.requireReviewDate;
      const deskDemand = {
        ...state.deskDemand,
        deskItem: state.deskDemand.deskItem.map((item) => {
          if (demandId === item.demandId) {
            return {
              ...item,
              topperReplyDate: requireReviewDate,
            };
          } else {
            return item;
          }
        })
      };
      return {
        ...state,
        askReview: action.payload,
        deskDemand: deskDemand,
      };
    }

    case 'REVIEW_TOPPER_SUCCESS': {
      return {
        ...state,
        review: action.payload
      };
    }

    case 'LOAD_UNINVITE_DEMANDS_SUCCESS': {
      return {
        ...state,
        unInviteDemands: action.payload
      };
    }

    case 'LOAD_UNCONFIRM_DEMANDS_SUCCESS': {
      return {
        ...state,
        unConfirmDemands: action.payload
      };
    }

    case 'SAVE_CHAT_DEMAND_SUCCESS': {
      return {
        ...state,
        saveDemand: action.payload,
      };
    }

    case 'LOAD_CHAT_DEFAULT_DEMAND_FROM': {
      return {
        ...state,
        defaultDemanderForm: action.payload,
      };
    }

    case 'ACTIVATE_CHAT_DEMANDER_SUCCESS': {
      return {
        ...state,
        activate: action.payload,
      };
    }

    case 'PAID_CHAT_SUBMIT_SUCCESS': {
      return {
        ...state,
        paid: action.payload,
      };
    }

    case 'LOAD_CONTACT_INFO_SUCCESS': {
      return {
        ...state,
        demandContactInfo: action.payload,
      };
    }
    case 'DENY_NEGOTIATING_SUCCESS':
    case 'LEAVE_TOPPER_CHATROOM_SUCCESS':
    case 'LEAVE_DEMANDER_CHATROOM_SUCCESS': {
      message.success('已退出聊天室！');
      return state;
    }
    default:
      return state;
  }
};

export default chatmetaReducer;
