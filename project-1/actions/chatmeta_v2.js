/* eslint-disable import/no-mutable-exports */
import { RSAA } from 'redux-api-middleware';
import TwilioChat from 'twilio-chat';
import { AccessManager } from 'twilio-common';
import { uaIsMobile } from 'react-device-detect';
import dayjs from 'dayjs';
import * as chatmetaUtil from '../util/chatmetaUtil';
import { loadStaticArea } from './common';
import { CHAT_MOBILE_PAGE } from '../config/constant';
import { error as sysError } from '../util/messageUtil.js';

export let twilioClient = null;
export let activeChannel = null;
export let activePage = null;
let accessManager = null;
let twilioListenerReference = null;

// 監聽新訊息
export const newMessageListener = (newMessages, dispatch, getState) => {
  console.log('newMessageListener ');
  const state = getState();
  const { user, chatmeta } = state;
  const { currentTab, roomId } = chatmeta;
  const isMessageAvailable = chatmetaUtil.isMessageAvailable(newMessages, currentTab, user.id);
  const isDemandStepChanges = chatmetaUtil.isDemandStepChanges(newMessages);
  const isChatStatusChangeMessage = roomId && isMessageAvailable && isDemandStepChanges;
  if (isChatStatusChangeMessage) {
    // 更新聊天室系統訊息
    dispatch(handleSystemMessage(newMessages));
  }
  // 更新聊天室雙方訊息
  dispatch(handleBothMessage(newMessages, isMessageAvailable));
};

const handleSystemMessage = newMessages => async (dispatch, getState) => {
  console.log('handleSystemMessage');
  const state = getState();
  const { chatmeta } = state;
  const {
    currentTab, roomId, role, selectedDemanderId, chatStatus, selectTopperId, selectedDemandId
  } = chatmeta;
  const { attributes } = newMessages.state;
  const isTopperHasRejected = currentTab == chatmetaUtil.ROLE.TOPPER && attributes.type == chatmetaUtil.SYSTEM_MESSAGE.MESSAGE3.type;
  let updatedChatstatus = chatStatus;
  try {
    console.log('更新系統訊息');
    dispatch(loadDeskDemand(roomId));
    dispatch(loadUnConfirmDemands(roomId));
    await dispatch(loadDemanderChatMeta(selectedDemandId));
    await dispatch(loadTopperChatMeta());
    // 抓取最新的meta
    const { topperChatmeta, demanderChatmeta } = getState().chatmeta;
    // 刷新目前的chatstatus
    if (demanderChatmeta && currentTab == chatmetaUtil.ROLE.DEMANDER) {
      const list = demanderChatmeta.list;
      const meta = list.find(item => item.topperId == selectTopperId);
      updatedChatstatus = meta ? meta.status : chatstatus;
    } else if (topperChatmeta && currentTab == chatmetaUtil.ROLE.TOPPER) {
      const list = topperChatmeta.list;
      const meta = list.find(item => item.demanderId == selectedDemanderId);
      updatedChatstatus = meta ? meta.status : chatstatus;
    }
    if (isTopperHasRejected) {
      // 高手被婉拒
      if (topperChatmeta.totalDemander > 0) {
        console.log('還有其他案主溝通中');
        dispatch(chooseTopper());
      } else if (chatmetaUtil.isDemander(role)) {
        console.log('還有案主身份');
        dispatch(chooseDemander());
      }
    }
  } catch (error) {
    console.error(error);
  }
  return dispatch({
    type: 'HANDLE_SYSTEM_MESSAGES',
    payload: {
      chatStatus: updatedChatstatus,
    }
  });
};

const handleBothMessage = (newMessages, isMessageAvailable) => async (dispatch, getState) => {
  console.log('handleBothMessage ');
  const state = getState();
  const { user, chatmeta, common } = state;
  const {
    roomId, demanderChatmeta, deskDemand, messages, imUnread
  } = chatmeta;
  const { area } = common;
  try {
    let updatedMessages = messages;
    const { topperUnReadMsgCount, demanderUnReadMsgCount } = imUnread;
    if (activeChannel && activeChannel.uniqueName === newMessages.channel.uniqueName) {
      const isDemandInDeskMenu = chatmetaUtil.isDemandInDeskMenu(newMessages.state, deskDemand);
      if (!isDemandInDeskMenu) {
        dispatch(loadDeskDemand(roomId));
      }
      if (isMessageAvailable) {
        const messageData = chatmetaUtil.formatMessage(newMessages.state, user.id, deskDemand, area);
        updatedMessages = [...updatedMessages, messageData];
      }
      // 標記聊天室已讀（代登不作己讀）
      if (user && !user.diedn) {
        activeChannel.setAllMessagesConsumed();
      }
    } else {
      // 不在該聊天室
      const unreadCount = await newMessages.channel.getUnconsumedMessagesCount();
      dispatch(setMessageUnReadCount(newMessages.channel.uniqueName, unreadCount));
      // 手機版未進入過聊天室 無activeChannel
      const isTopperUnread = activeChannel && demanderChatmeta.list.find(item => item.roomId === activeChannel.uniqueName);
      if (isTopperUnread) {
        dispatch(updateChatListTabDot(topperUnReadMsgCount, unreadCount));
      } else {
        dispatch(updateChatListTabDot(unreadCount, demanderUnReadMsgCount));
      }
    }
    dispatch(updateNewMessage(updatedMessages));
  } catch (error) {
    console.error(error);
  }
  return dispatch({
    type: 'HANDLE_BOTH_MESSAGES'
  });
};


// 更新目前選取的聊天室訊息
export const updateNewMessage = messages => (dispatch) => {
  dispatch(onUpdateMessageUnreadCount());
  return dispatch({
    type: 'UPDATE_NEW_MESSAGE',
    payload: {
      messages: messages,
      isLoadingNewMessage: true,
    }
  });
};

// 送出訊息
export const onSendMessage = newMessage => (dispatch) => {
  if (activeChannel && newMessage.length > 0) {
    try {
      activeChannel.sendMessage(newMessage);
      return dispatch({
        type: 'SEND_NEW_MESSAGE',
        payload: {
          newMessage: newMessage,
          isLoadingNewMessage: true,
        }
      });
    } catch (error) {
      // session error
      console.log('error when send message : ', error);
      dispatch(initializeTwilio()).then(() => {
        activeChannel.sendMessage(newMessage);
        return dispatch({
          type: 'SEND_NEW_MESSAGE',
          payload: {
            newMessage: newMessage,
            isLoadingNewMessage: true,
          }
        });
      });
    }
  }
};

// 更新聊天室讀取狀態
export const onUpdateMessageUnreadCount = () => async (dispatch) => {
  if (activeChannel) {
    const memberList = await activeChannel.getMembers();
    return dispatch({
      type: 'UPDATE_READ_MESSAGE',
      payload: {
        memberList: memberList,
        isLoadingNewMessage: false,
      }
    });
  } else {
    return dispatch({
      type: 'UPDATE_READ_MESSAGE_FAILURE',
    });
  }
};

export const onChangeMobilePage = status => (dispatch) => {
  return dispatch({
    type: 'CHANGE_MOBILE_CHAT_PAGE',
    payload: {
      mobilePageType: status || CHAT_MOBILE_PAGE.chatlist,
      isLoadingNewMessage: false,
    }
  });
};

export const selectDemandDropdown = demandId => (dispatch) => {
  dispatch(loadDemanderChatMeta(demandId));
  return dispatch({
    type: 'SELECT_DEMAND_DROPDOWN',
    payload: {
      selectedDemandId: demandId,
      selectTopperId: '',
    }
  });
};

export const uploadFile = file => async (dispatch) => {
  const isFileSizeValid = chatmetaUtil.isFileSizeValid(file);
  if (isFileSizeValid) {
    const data = new FormData();
    data.append('file', file);
    data.append('file', file, file.name);
    dispatch({
      type: 'REQUEST_UPLOAD_FILE',
    });
    await activeChannel.sendMessage(data);
    dispatch(onUpdateMessageUnreadCount());
    return dispatch({
      type: 'UPLOAD_FILE_SUCCESS',
    });
  } else {
    sysError('chat-upload-limit');
    return dispatch({
      type: 'UPLOAD_FILE_FAILURE',
    });
  }
};

export const downloadFile = (media, sid, messages) => async (dispatch) => {
  // 從訊息抓取要下載的檔案路徑
  const messageIndex = messages.findIndex(msg => msg.sid == sid);
  const shouldGetNewUrl = !('mediaTimestamp' in messages[messageIndex]) || (dayjs().unix() - messages[messageIndex].mediaTimestamp) > 10;
  const mediaUrl = shouldGetNewUrl ? await media.getContentUrl() : messages[messageIndex].mediaUrl;
  console.log(`shouldGetNewUrl: ${shouldGetNewUrl}`);

  if (shouldGetNewUrl) {
    messages[messageIndex].mediaUrl = mediaUrl;
    messages[messageIndex].mediaTimestamp = dayjs().unix();
  }

  await fetch(mediaUrl).then((response) => {
    response.blob().then((blob) => {
      const fileUrl = window.URL.createObjectURL(blob);
      const anchorElement = document.createElement('a');
      anchorElement.href = fileUrl;
      anchorElement.download = media.filename;
      anchorElement.click();
      return dispatch({
        type: 'DOWNLOAD_FILE_SUCCESS',
      });
    });
  }, () => {
    return dispatch({
      type: 'DOWNLOAD_FILE_FAILURE',
    });
  });
};

export const updateScrollMessage = event => (dispatch, getState) => {
  const state = getState();
  const { chatmeta } = state;
  const { messages } = chatmeta;
  const isMobile = uaIsMobile();
  const isMobileBrowser = isMobile && document.scrollingElement;
  const target = event.target;
  const isChatroomNotEmpty = messages && messages.length !== 0;
  const isUserScrollToTop = isMobileBrowser ? document.scrollingElement.scrollTop < 5 && activePage && activePage.hasPrevPage : target.scrollTop < 5 && activePage && activePage.hasPrevPage;
  if (isUserScrollToTop && isChatroomNotEmpty) {
    return dispatch(updateActivePage());
  }
};

export const updateActivePage = () => async (dispatch, getState) => {
  const state = getState();
  const { user, chatmeta, common } = state;
  const { messages, currentTab, deskDemand } = chatmeta;
  const { area } = common;
  let newMessages = [];
  activePage = await activePage.prevPage();
  activePage.items.reverse().forEach((message) => {
    if (chatmetaUtil.isMessageAvailable(message, currentTab, user.id)) {
      const messageData = chatmetaUtil.formatMessage(message.state, user.id, deskDemand, area);
      newMessages = [messageData, ...newMessages];
    }
  });
  newMessages = [...newMessages, ...messages];
  return dispatch({
    type: 'UPDATE_ACTIVE_PAGE_SUCCESS',
    payload: {
      messages: newMessages,
      isUpdatingMessage: false,
      isLoadingNewMessage: false,
    }
  });
};

export const initialChat = (demanderId, demandId, topperId) => async (dispatch, getState) => {
  const isMobile = uaIsMobile();
  // 同時request chatmeta API提升速度
  await Promise.all([dispatch(loadTopperChatMeta()), dispatch(loadDemanderChatMeta(demandId))]);

  const state = getState();
  const { topperChatmeta, demanderChatmeta } = state.chatmeta;
  const isTopper = topperChatmeta && topperChatmeta.list.length > 0;
  const userRole = isTopper ? [chatmetaUtil.ROLE.DEMANDER, chatmetaUtil.ROLE.TOPPER] : [chatmetaUtil.ROLE.DEMANDER];
  const isMyDemanderTab = demanderId && chatmetaUtil.isTopper(userRole);
  const isMyTopperTab = (topperId || demandId) && chatmetaUtil.isDemander(userRole);
  let currentTab = chatmetaUtil.ROLE.DEMANDER;
  if (isMyDemanderTab) {
    currentTab = chatmetaUtil.ROLE.TOPPER;
  } else if (isMyTopperTab) {
    currentTab = chatmetaUtil.ROLE.DEMANDER;
  } else {
    currentTab = chatmetaUtil.ROLE.TOPPER;
  }
  dispatch(loadDemanderMenu());
  dispatch(loadStaticArea());
  await dispatch(initializeTwilio());
  if (isMobile) {
    if (topperId) {
      const topperMeta = demanderChatmeta.list.find(item => item.topperId == topperId);
      if (topperMeta) {
        dispatch(onChangeMobilePage(CHAT_MOBILE_PAGE.chatroom));
        dispatch(handleTopperClick(topperMeta));
      }
    } else if (demanderId) {
      const demanderMeta = topperChatmeta.list.find(item => item.demanderId == demanderId);
      if (demanderMeta) {
        dispatch(onChangeMobilePage(CHAT_MOBILE_PAGE.chatroom));
        dispatch(handleDemanderClick(demanderMeta));
      }
    }
  }
  return dispatch({
    type: 'INITIAL_CHATROLE',
    payload: {
      role: userRole,
      selectedDemanderId: demanderId || '',
      selectedDemandId: demandId || '-1',
      selectTopperId: topperId || '',
      currentTab: currentTab,
      isInitializedChatRole: true,
    }
  });
};

export const cleanChatroom = () => async (dispatch) => {
  return dispatch({
    type: 'CLEAN_CHATROOM',
    payload: {
      roomId: '',
      messages: [],
      topperMeta: { topperId: '', roomId: '' },
      demanderMeta: { demanderId: '', roomId: '' },
      selectedDemanderId: '',
      selectTopperId: '',
      isLoadingInitialMessages: false,
      chatStatus: '',
    }
  });
};

// 更新聊天室選單上面的紅點
export const updateChatListTabDot = (topperUnReadMsgCount, demanderUnReadMsgCount) => (dispatch) => {
  return dispatch({
    type: 'UPDATE_CHATLIST_TABDOT',
    payload: {
      topperUnReadMsgCount: topperUnReadMsgCount,
      demanderUnReadMsgCount: demanderUnReadMsgCount,
    }
  });
};

export const changeRoleTab = event => (dispatch) => {
  const key = event.key;
  dispatch({
    type: 'CHANGE_CHAT_TAB',
    payload: {
      currentTab: key,
      roomId: '',
      messages: [],
      isLoadingInitialMessages: false,
      isLoadingNewMessage: false,
      memberList: [],
    }
  });
};

export const reloadChatMeta = () => (dispatch) => {
  dispatch(loadTopperChatMeta());
  dispatch(loadDemanderChatMeta());
  dispatch(cleanChatroom());
};

export const initializeTwilio = () => async (dispatch, getState) => {
  // 清空初始所有狀態
  twilioClient = null;
  activeChannel = null;
  activePage = null;
  accessManager = null;
  const getTokenResponse = await dispatch(getToken());
  const token = getTokenResponse.payload;
  if (token) {
    // 登入狀態才有Token
    const chatClientResponse = await dispatch(createChatClient(token));
    if (chatClientResponse.error) {
      // Token過期，產生新token
      const getNewTokenResponse = await dispatch(getToken(true));
      const newToken = getNewTokenResponse.payload;
      const newChatClientResponse = await dispatch(createChatClient(newToken));
      if (newChatClientResponse.error) {
        console.log('create chat client 2nd failed');
        return dispatch({
          type: 'INTITIAL_TWILIO_FAILURE',
        });
      } else {
        console.log('create chat client 2nd success');
        twilioClient = newChatClientResponse.payload.client;
        updateAccessManager(newToken);
      }
    } else {
      console.log('create chat client success');
      twilioClient = chatClientResponse.payload.client;
      updateAccessManager(token);
    }
  }
  if (twilioClient) {
    twilioListenerReference = messages => newMessageListener(messages, dispatch, getState);
    twilioClient.on('messageAdded', twilioListenerReference);
  }

  return dispatch({
    type: 'INITIAL_TWILIO',
    payload: {
      hasInitialTwilio: true,
    }
  });
};

export const exitMessageListener = () => (dispatch) => {
  dispatch(cleanChatroom());
  if (twilioClient && twilioListenerReference) {
    twilioClient.removeListener('messageAdded', twilioListenerReference);
  }
  // 清空初始所有狀態
  twilioClient = null;
  activeChannel = null;
  activePage = null;
  accessManager = null;
  return dispatch({
    type: 'UNMOUNT_TWILIO',
    payload: {
      mobilePageType: CHAT_MOBILE_PAGE.chatlist,
      hasInitialTwilio: false,
      isInitializedChatRole: false,
      isChatLoading: true,
      demanderChatmeta: {
        totalTopper: 0,
        list: [],
        demandId: '',
        demandTitle: '',
        nextKey: null
      },
      topperChatmeta: {
        totalDemander: 0,
        list: [],
        processing: [],
        inviting: [],
        nextKey: null,
      },
    }
  });
};

/**
   * 案主切換案件
   */
export const handleDemandChange = demandId => (dispatch, getState) => {
  const state = getState();
  const demanderMenu = state.chatmeta.demanderMenu;
  const selectedDemand = demanderMenu.find(demand => demand.demandId == demandId) || { demandId: '-1' };
  dispatch(loadDemanderChatMeta(selectedDemand.demandId));
  return dispatch({
    type: 'DEMAND_CHANGE',
    payload: {
      selectedDemandId: selectedDemand.demandId,
    }
  });
};

export const chooseDemander = () => async (dispatch, getState) => {
  const state = getState();
  const { chatmeta, user } = state;
  const {
    selectedDemanderId, topperChatmeta
  } = chatmeta;
  const demanderMeta = selectedDemanderId == '' ? topperChatmeta.list[0] : topperChatmeta.list.find(meta => meta.demanderId == selectedDemanderId);
  if (demanderMeta && demanderMeta.roomId) {
    // console.log(`我的案主初始化 / 高手切換案主, 案主meta: ${JSON.stringify(demanderMeta)}`);
    dispatch(loadDeskDemand(demanderMeta.roomId));
    dispatch(getInitailMessages(demanderMeta.roomId));
    dispatch(loadUnConfirmDemands(demanderMeta.roomId));
    dispatch(loadGigs(user.id));
    return dispatch({
      type: 'CHOOSE_DEMANDER',
      payload: {
        roomId: demanderMeta.roomId,
        selectedDemanderId: demanderMeta.demanderId,
        isLoadingNewMessage: true,
        chatStatus: demanderMeta.status,
        demanderMeta: demanderMeta,
      }
    });
  } else {
    // 列表沒選項，清空聊天室
    console.log('選擇預設案主清空');
    return dispatch(cleanChatroom()).then(() => {
      return dispatch({
        type: 'CHOOSE_DEMANDER',
        payload: {
          roomId: '',
          selectedDemanderId: '',
          chatStatus: chatmetaUtil.ROOM_STATUS.CLOSE,
          messages: [],
          isLoadingNewMessage: false,
        }
      });
    });
  }
};

export const chooseTopper = () => async (dispatch, getState) => {
  const state = getState();
  const { chatmeta } = state;
  const {
    demanderChatmeta, selectTopperId
  } = chatmeta;
  const list = demanderChatmeta.list;
  const isListNotEmpty = typeof list !== 'undefined' && list.length > 0;
  const topperMeta = list.find(item => item.topperId == selectTopperId);
  if (topperMeta) {
    dispatch(loadDeskDemand(topperMeta.roomId));
    dispatch(getInitailMessages(topperMeta.roomId));
    dispatch(loadUnConfirmDemands(topperMeta.roomId));
    dispatch(loadUnInviteDemands(topperMeta.topperId));
    dispatch(loadGigs(topperMeta.topperId));
    return dispatch({
      type: 'CHOOSE_TOPPER',
      payload: {
        roomId: topperMeta.roomId,
        selectTopperId: topperMeta.topperId,
        isLoadingNewMessage: true,
        chatStatus: topperMeta.status,
        topperMeta: topperMeta,
      }
    });
  } else if (isListNotEmpty) {
    dispatch(loadDeskDemand(list[0].roomId));
    dispatch(getInitailMessages(list[0].roomId));
    dispatch(loadUnConfirmDemands(list[0].roomId));
    dispatch(loadUnInviteDemands(list[0].topperId));
    dispatch(loadGigs(list[0].topperId));
    return dispatch({
      type: 'CHOOSE_TOPPER',
      payload: {
        roomId: list[0].roomId,
        selectTopperId: list[0].topperId,
        isLoadingNewMessage: true,
        chatStatus: list[0].status,
        topperMeta: list[0],
      }
    });
  } else {
    // 列表沒選項，清空聊天室
    console.log('選擇預設高手清空');
    return dispatch(cleanChatroom()).then(() => {
      return dispatch({
        type: 'CHOOSE_TOPPER',
        payload: {
          roomId: '',
          selectTopperId: '',
          chatStatus: chatmetaUtil.ROOM_STATUS.CLOSE,
          messages: [],
          isLoadingNewMessage: false,
        }
      });
    });
  }
};

/**
   * 案主選擇我的高手清單的高手
   */
export const handleTopperClick = topperMeta => async (dispatch) => {
  await dispatch(cleanChatroom());
  dispatch(loadDeskDemand(topperMeta.roomId));
  dispatch(getInitailMessages(topperMeta.roomId));
  dispatch(loadUnConfirmDemands(topperMeta.roomId));
  dispatch(loadUnInviteDemands(topperMeta.topperId));
  dispatch(loadGigs(topperMeta.topperId));
  dispatch({
    type: 'TOPPER_CLICK',
    payload: {
      roomId: topperMeta.roomId,
      selectTopperId: topperMeta.topperId,
      chatStatus: topperMeta.status,
      topperMeta: topperMeta,
      isLoadingNewMessage: true,
    }
  });
};

/**
   * 高手選擇我的案主清單的案主
   */
export const handleDemanderClick = demanderMeta => async (dispatch, getState) => {
  const state = getState();
  const { user } = state;
  await dispatch(cleanChatroom());
  dispatch(loadDeskDemand(demanderMeta.roomId));
  dispatch(getInitailMessages(demanderMeta.roomId));
  dispatch(loadUnConfirmDemands(demanderMeta.roomId));
  dispatch(loadGigs(user.id));
  dispatch({
    type: 'DEMANDER_CLICK',
    payload: {
      roomId: demanderMeta.roomId,
      selectedDemanderId: demanderMeta.demanderId,
      chatStatus: demanderMeta.status,
      demanderMeta: demanderMeta,
      isLoadingNewMessage: true,
    }
  });
};

export const updateMessages = messages => (dispatch) => {
  return dispatch({
    type: 'UPDATE_MESSAGE',
    payload: {
      messages: messages,
      isLoadingInitialMessages: false,
      isLoadingNewMessage: true,
    }
  });
};

// 取得聊天室訊息
export const getInitailMessages = roomId => async (dispatch, getState) => {
  const state = getState();
  const { chatmeta, user, common } = state;
  const {
    deskDemand, currentTab
  } = chatmeta;
  const { area } = common;
  let messages = [];
  if (roomId && twilioClient) {
    try {
      dispatch({
        type: 'REQUEST_INITIAL_MESSAGES',
        payload: {
          isLoadingInitialMessages: true,
        },
      });
      activeChannel = await twilioClient.getChannelByUniqueName(roomId);
      activePage = await activeChannel.getMessages(chatmetaUtil.DEFAULT_MESSAGE_COUNT);
      activePage.items.forEach((message) => {
        if (chatmetaUtil.isMessageAvailable(message, currentTab, user.id)) {
          const messageData = chatmetaUtil.formatMessage(message.state, user.id, deskDemand, area);
          messages = [...messages, messageData];
        }
      });
      // 標記聊天室已讀（代登不作己讀）
      if (user && !user.diedn) {
        activeChannel.setAllMessagesConsumed();
      }
      dispatch(onUpdateMessageUnreadCount());
      dispatch(setMessageUnReadCount(roomId, 0));
      return dispatch(updateMessages(messages));
    } catch (error) {
      // 重新產生token
      console.log('failed while get channel');
      await dispatch(initializeTwilio());
      try {
        activeChannel = await twilioClient.getChannelByUniqueName(roomId);
        activePage = await activeChannel.getMessages(chatmetaUtil.DEFAULT_MESSAGE_COUNT);
        activePage.items.forEach((message) => {
          if (chatmetaUtil.isMessageAvailable(message, currentTab, user.id)) {
            const messageData = chatmetaUtil.formatMessage(message.state, user.id, deskDemand, area);
            messages = [...messages, messageData];
          }
        });
      } catch (messageError) {
        console.log('messageError when renew token: ', messageError);
      }
      // 標記聊天室已讀（代登不作己讀）
      if (user && !user.diedn) {
        activeChannel.setAllMessagesConsumed();
      }
      dispatch(onUpdateMessageUnreadCount());
      dispatch(setMessageUnReadCount(roomId, 0));
      return dispatch(updateMessages(messages));
    }
  } else {
    console.log('無法取得roomId: ', roomId);
    return dispatch({
      type: 'INITIAL_MESSAGES_FAILURE',
    });
  }
};

export const getToken = (isTokenExpired) => {
  return {
    [RSAA]: {
      endpoint: `/api/token${isTokenExpired ? '?renew=true' : ''}`,
      method: 'GET',
      credentials: 'same-origin',
      types: [
        'GET_TOKEN_REQUEST',
        'GET_TOKEN_SUCCESS',
        'GET_TOKEN_FAILURE',
      ]
    }
  };
};


/**
 * [需求者]選取需求，發送邀請給[高手]
 * @param {integer} topperId 高手 id
 * @param {string[]} demandIdList
 */
export const inviteChat = (topperId, demandIdList) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/inviteChat',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topperId: topperId,
        demandIdList: demandIdList,
      }),
      types: [
        'REQUEST_INVITE_CHAT',
        'INVITE_CHAT_SUCCESS',
        'INVITE_CHAT_FAILURE',
      ]
    }
  };
};

/**
 * [高手]同意[需求者]的邀請繼續溝通
 * @param {string} demandId
 * @param {integer} roomId
 */
export const acceptChat = (demandId, roomId) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/acceptChat',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        demandId: demandId,
        roomId: roomId,
      }),
      types: [
        'REQUEST_ACCEPT_CHAT',
        'ACCEPT_CHAT_SUCCESS',
        'FAILURE',
      ]
    }
  };
};


/**
 * [高手]無法接案，拒絕[需求者]的邀請繼續溝通
 * @param {string} demandId
 * @param {integer} roomId
 */
export const rejectChat = (demandId, roomId) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/rejectChat',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        demandId: demandId,
        roomId: roomId,
      }),
      types: [
        'REQUEST_REJECT_CHAT',
        'REJECT_CHAT_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * 選取案件邀請對方進行回報合作
 * @param {integer} roomId imPk
 * @param {string[]} demandIdList
 */
export const askConfirmChat = (roomId, demandIdList) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/askConfirm',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: roomId,
        demandIdList: demandIdList,
      }),
      types: [
        'REQUEST_ASK_CONFIRM_CHAT',
        'ASK_CONFIRM_CHAT_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

export const askSingleConfirmChat = (roomId, demandId) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/askConfirm',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: roomId,
        demandIdList: [demandId],
      }),
      types: [
        'REQUEST_ASK_CONFIRM_CHAT',
        'ASK_CONFIRM_CHAT_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * 對方所邀請的回報合作案件，確認合作
 * @param {integer} roomId imPk
 * @param {string[]} demandIdList
 */
export const confirmChat = (roomId, demandIdList) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/confirm',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: roomId,
        demandIdList: demandIdList,
      }),
      types: [
        'REQUEST_CONFIRM_CHAT',
        'CONFIRM_CHAT_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * 對方所邀請的回報合作案件，尚未確認合作
 * @param {integer} roomId imPk
 * @param {string[]} demandIdList
 */
export const unConfirmChat = (roomId, demandIdList) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/unconfirm',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: roomId,
        demandIdList: demandIdList,
      }),
      types: [
        'REQUEST_UNCONFIRM_CHAT',
        'UNCONFIRM_CHAT_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * [高手]選擇需求對應的服務項目，邀請[需求者]進行評價
 */
export const askReview = (roomId, reviewBody) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/askReview',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: roomId,
        reviewBody: reviewBody,
      }),
      types: [
        'REQUEST_ASK_REVIEW',
        'ASK_REVIEW_SUCCESS',
        'FAILURE',
      ]
    }
  };
};


/**
 * [需求者]針對需求選定服務項目評價[高手]
 */
export const reviewTopper = (roomId, reviewBody) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/reviewTopper',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: roomId,
        reviewBody: reviewBody,
      }),
      types: [
        'REQUEST_REVIEW_TOPPER',
        'REVIEW_TOPPER_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * [需求者]開放中的需求列表
 */
export const loadDemanderMenu = () => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/demanderMenu',
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_LOAD_DEMANDER_MENU',
        'LOAD_DEMANDER_MENU_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * [需求者]針對需求列出各種合作狀態中的[高手]聊天室
 * @param {*} demandId 案件編號
 */
export const loadDemanderChatMeta = (demandId = '', nextKey) => {
  return {
    [RSAA]: {
      endpoint: `/api/chat/demanderChatmeta/${demandId || '-1'}${(nextKey ? '?cursor=' + nextKey : '')}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_LOAD_DEMANDER_CASE_CHATMETA',
        'LOAD_DEMANDER_CASE_CHATMETA_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * [高手]合作中或收到溝通邀請的[需求者]聊天室
 */
export const loadTopperChatMeta = (nextKey) => {
  return {
    [RSAA]: {
      endpoint: `/api/chat/topperChatmetaV2${(nextKey ? '?cursor=' + nextKey : '')}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_LOAD_TOPPER_CHATMETA',
        'LOAD_TOPPER_CHATMETA_SUCCESS_V2',
        'FAILURE',
      ]
    }
  };
};

/**
 * 聊天室進行中的需求
 * @param {string} roomId imPk
 */
export const loadDeskDemand = (roomId) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/deskDemand/' + roomId,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_LOAD_DESK_DEMAND',
        'LOAD_DESK_DEMAND_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * [需求者]快速發送其他需求 - 選單
 * @param {*} topperId 高手 id
 */
export const loadUnInviteDemands = (topperId) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/unInviteDemands/' + topperId,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_LOAD_UNINVITE_DEMANDS',
        'LOAD_UNINVITE_DEMANDS_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * 可回報合作的需求列表
 * @param {*} demandId 案件編號
 */
export const loadUnConfirmDemands = (roomId) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/unConfirmDemands/' + roomId,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_LOAD_UNCONFIRM_DEMANDS',
        'LOAD_UNCONFIRM_DEMANDS_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * 成交評價時，可選取的服務項目
 */
export const loadGigs = (basicId) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/gigs/' + basicId,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_LOAD_GIGS',
        'LOAD_GIGS_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/** 需求相關 API * */

/**
 * 新增需求
 * @param {*} demandForm
 */
export const addDemand = (demandBody) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/saveDemand',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demandBody: demandBody }),
      types: [
        'REQUEST_SAVE_CHAT_DEMAND',
        'SAVE_CHAT_DEMAND_SUCCESS',
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
export const modifyDemand = (demandId, demandBody) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/saveDemand/' + demandId,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        demandBody: demandBody
      }),
      types: [
        'REQUEST_SAVE_CHAT_DEMAND',
        'SAVE_CHAT_DEMAND_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * 填寫資料頁的預設資訊
 */
export const getDefaultDemanderForm = () => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/defaultDemanderForm',
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_LOAD_CHAT_DEFAULT_DEMAND',
        'LOAD_CHAT_DEFAULT_DEMAND_FROM',
        'FAILURE',
      ]
    }
  };
};

/**
 * 啟用demander
 * @param {*} demandVerifyForm
 */
export const activateDemander = (demandVerifyForm) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/activateDemander',
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        demandVerifyForm: demandVerifyForm
      }),
      types: [
        'REQUEST_ACTIVATE_CHAT_DEMANDER',
        'ACTIVATE_CHAT_DEMANDER_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * 繳納需求保證金
 * @param {*} demandId
 * @param {*} partBId
 */
export const demandPaidSubmit = (demandId, partBId) => {
  return {
    [RSAA]: {
      endpoint: '/api/chat/' + partBId + '/paid/' + demandId,
      method: 'PUT',
      credentials: 'include',
      types: [
        'REQUEST_PAID_CHAT_SUBMIT',
        'PAID_CHAT_SUBMIT_SUCCESS',
        'FAILURE'
      ]
    }
  };
};

/** 回饋相關API * */

/**
 * 撰寫溝通評價
 */
export const saveDemanderSurvey = (ranking) => {
  return {
    [RSAA]: {
      endpoint: '/api/feedback/saveDemanderSurvey',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ranking: ranking
      }),
      types: [
        'REQUEST_SAVE_DEMANDER_SURVEY',
        'SAVE_DEMANDER_SURVEY_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/** Twilio 相關 API * */

async function asyncForeach(elements, callback) {
  const callbacks = [];

  for (let element of elements) {
    callbacks.push(callback(element));
  }
  let result = await Promise.all(callbacks);

  return result;
}

/**
 * token 失效時更新
 * @param {object} client twilio client
 * @param {object} token
 */
export const updateAccessManager = (token) => {
  accessManager = new AccessManager(token.jwt);
  // get new token from AccessManager and pass it to the library instance
  accessManager.on('tokenUpdated', (am) => {
    console.log('token updated');
    twilioClient.updateToken(am.token);
  });
  // generate new token here and set it to the accessManager
  accessManager.on('tokenExpired', async () => {
    console.log('token expired');
    try {
      const newToken = await fetch('/api/token?renew=true', { method: 'GET', credentials: 'same-origin' }).then(response => response.json());
      accessManager.updateToken(newToken.jwt);
    } catch (error) {
      console.log('getToken error', error);
    }
  });
};

/**
 * 建立 twilio client
 * @param {object} token
 */
export const createChatClient = token => async (dispatch) => {
  try {
    twilioClient = await TwilioChat.create(token.jwt);
    return dispatch({
      type: 'CREATE_CHAT_CLIENT',
      payload: {
        client: twilioClient,
      }
    });
  } catch (error) {
    console.log('creat chat client failed');
    console.dir(error);
    return dispatch({
      type: 'CREATE_CHAT_CLIENT_FAILURE',
      error: error,
    });
  }
};


/**
 * 更新訊息讀取狀態
 * @param {Object} twilioClient
 * @param {Object} chatmeta
 */
export const updateMessageCount = (chatmeta) => {
  return async (dispatch) => {
    chatmeta.client = twilioClient;
    let message = Object.assign({}, chatmeta);

    if (message.demanderChatmeta.list) {
      await asyncForeach(message.demanderChatmeta.list, async (top) => {
        activeChannel = await twilioClient.getChannelByUniqueName(top.imPk);
        top.totalMessage = (activeChannel.lastMessage && activeChannel.lastConsumedMessageIndex) ? activeChannel.lastMessage.index - activeChannel.lastConsumedMessageIndex : 0;
      });
    }
    dispatch({
      type: 'UPDATE_MESSAGE_COUNT_SUCCESS',
      payload: message,
    });
  };
};

/**
 * 設定未讀訊息數量
 *
 * @param {*} chatmeta
 * @param {*} roomId im pk
 * @param {*} unReadCount
 */
export const setMessageUnReadCount = (roomId, unReadCount) => {
  return {
    type: 'UPDATE_MESSAGE_UNREAD_COUNT_SUCCESS',
    payload: {
      roomId,
      unReadCount
    },
  };
};

/**
 * TODO: 加入聊天室
 * @param {string} imPk im pk
 * @param {number} basicId 會員 pk
 */
export const joinChannel = (imPk) => {
  return {
    [RSAA]: {
      endpoint: '/api/channel/join',
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imPk: imPk,
      }),
      types: [
        'REQUEST_JOIN_CHANNEL',
        'JOIN_CHANNEL_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

/**
 * 查看單一案件聯絡人資料
 * @param {string} demandId 案件編號 EX: Demand-2729939760975542
 * @param {string} roomId im 編號 EX: 2712610096223200_3108531535831448
 */
export const loadDemandContactInfo = (demandId, roomId) => {
  return {
    [RSAA]: {
      endpoint: `/api/chat/demandContactInfo/${demandId}/${roomId}`,
      method: 'GET',
      credentials: 'include',
      types: [
        'REQUEST_LOAD_CONTACT_INFO',
        'LOAD_CONTACT_INFO_SUCCESS',
        'FAILURE',
      ]
    }
  };
};

export const leaveTopperChatroom = (roomIdList) => {
  return {
    [RSAA]: {
      endpoint: `/api/chat/topper/leave/${encodeURIComponent(roomIdList.join(','))}`,
      method: 'DELETE',
      credentials: 'include',
      types: [
        'REQUEST_LEAVE_TOPPER_CHATROOM',
        'LEAVE_TOPPER_CHATROOM_SUCCESS',
        'FAILURE'
      ]
    }
  };
};

export const leaveDemanderChatroom = (roomIdList) => {
  return {
    [RSAA]: {
      endpoint: `/api/chat/demander/leave/${encodeURIComponent(roomIdList.join(','))}`,
      method: 'DELETE',
      credentials: 'include',
      types: [
        'REQUEST_LEAVE_DEMANDER_CHATROOM',
        'LEAVE_DEMANDER_CHATROOM_SUCCESS',
        'FAILURE'
      ]
    }
  };
};

export const userDenyNegotiating = (roomId, isDeny) => {
  return {
    [RSAA]: {
      endpoint: `/api/chat/denyNegotiating/${roomId}/${isDeny}`,
      method: 'PUT',
      credentials: 'include',
      types: [
        'REQUEST_DENY_NEGOTIATING',
        'DENY_NEGOTIATING_SUCCESS',
        'FAILURE'
      ]
    }
  };
};
