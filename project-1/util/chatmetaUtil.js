import TwilioChat from 'twilio-chat';
import { AccessManager } from 'twilio-common';
import { catSearch } from './categoryUtils';
import { targetDataV2, priceType } from '../config/selectData';
import { moneyFormat } from './commonUtil';
import { optionsToTable } from './formatUtil';

const targetTable = optionsToTable(targetDataV2);

/**
 * 預設訊息數量
 */
export const DEFAULT_MESSAGE_COUNT = 20;

/**
 * 身份
 * - 1: 案主-我的高手
 * - 2: 高手-我的案主
 */
export const ROLE = {
  DEMANDER: '1',
  TOPPER: '2',
};

export function isDemander(roles) {
  return roles.includes(ROLE.DEMANDER);
}

export function isTopper(roles) {
  return roles.includes(ROLE.TOPPER);
}

export const ROOM_STATUS = {
  INVITING: '0',
  NEGOTIATING: '1',
  CLOSE: '2'
};

/**
 * 聊天狀態
 * - 0: 邀請中
 * - 1: 溝通中
 * - 2: 回報合作
 * - 3: 已評價
 * - 4: 已回絕(高手不同意溝通)
 * - 5: 未合作(30天未回報合作)
 * - 6: 案件關閉已退保證金
 */
// dealStep(交易階段): [2:合作][3:評價]
export const DEMAND_STEP = {
  INVITING: '0',
  NEGOTIATING: '1',
  COPERATION: '2',
  EVALUATION: '3',
  REJECTION: '4',
  UNCOOPERATIVE: '5',
  CLOSE: '6'
};

export const DEMANDER_CHATROOM_STEP = [
  { status: 'inviting', statusNo: DEMAND_STEP.INVITING },
  { status: 'negotiating', statusNo: DEMAND_STEP.NEGOTIATING },
  { status: 'coperation', statusNo: DEMAND_STEP.COPERATION },
  { status: 'evaluation', statusNo: DEMAND_STEP.EVALUATION },
  { status: 'rejection', statusNo: DEMAND_STEP.REJECTION },
  { status: 'uncooperative', statusNo: DEMAND_STEP.UNCOOPERATIVE },
];

export const TOOPER_ROOM_STATUS = {
  PROCESSING: 'processing',
  INVITING: 'inviting',
};

export const TOPPER_CHATROOM_STEP = [
  { status: 'processing', statusDesc: TOOPER_ROOM_STATUS.PROCESSING, statusValue: '1' },
  { status: 'inviting', statusDesc: TOOPER_ROOM_STATUS.INVITING, statusValue: '0' },
];

export const uiMessage = {
  evaluate: {
    evaluateTopper: '品質好，態度佳，速度快，非常值得再次合作!',
    askDemander: '「本次合作愉快，麻煩您花30秒，幫我累積一下評價 / 評論，讓我得以更進步，在此先感謝您 !」',
  }
};

/**
 * 系統訊息
 * - type: 類別
 * - action: 出現按鈕
 */
export const SYSTEM_MESSAGE = {
  MESSAGE1: { type: 'system_msg1', action_button: 'invite_ask1' },
  MESSAGE2: { type: 'system_msg2', action_button: 'view_demander_contact' }, // TODO
  MESSAGE2_1: { type: 'system_msg2_1', action_button: 'view_demander_contact' }, // TODO
  MESSAGE2_2: { type: 'system_msg2_2', action_button: 'view_demander_contact' },
  MESSAGE3: { type: 'system_msg3', action_button: 'topper_list' },
  MESSAGE4: { type: 'system_msg4', action_button: '' },
  MESSAGE5: { type: 'system_msg5', action_button: 'cooperate_ask1' },
  MESSAGE6: { type: 'system_msg6', action_button: 'cooperate_ask2' },
  MESSAGE7: { type: 'system_msg7', action_button: '' },
  MESSAGE8: { type: 'system_msg8', action_button: '' },
  MESSAGE9: { type: 'system_msg9', action_button: 'cooperate_ask3' },
  MESSAGE10: { type: 'system_msg10', action_button: '' },
  MESSAGE11: { type: 'system_msg11', action_button: '' },
  MESSAGE12: { type: 'system_msg12', action_button: 'evaluate_ask' },
  MESSAGE13: { type: 'system_msg13', action_button: 'manage_demand' },
  MESSAGE14: { type: 'system_msg14', action_button: 'check_deamnd1' },
  MESSAGE15: { type: 'system_msg15', action_button: '' },
  MESSAGE16: { type: 'system_msg16', action_button: '' },
  MESSAGE17: { type: 'system_msg17', action_button: '' },
  MESSAGE23: { type: 'system_msg23', action_button: 'leave_topper' },
  MESSAGE23_1: { type: 'system_msg23_1', action_button: 'leave_topper' },
  MESSAGE24: { type: 'system_msg24', action_button: 'leave_demander' },
  MESSAGE24_1: { type: 'system_msg24_1', action_button: 'leave_demander' },
};

function status(response) {
  if (response.ok) {
    return response.json();
  }
  return response.json().then((err) => {
    err.status = response.status;
    throw err;
  });
}
/**
 * 取得 twilio token
 */
export async function getToken(renew) {
  console.log('renew', renew);
  let token;
  try {
    token = await fetch(`/api/token${renew ? '?renew=true' : ''}`, { method: 'get', credentials: 'same-origin' }).then(status);
  } catch (e) {
    console.log('get token error');
    console.log(e);
  }
  return token;
}

/**
 * 建立 twilio client
 * @param {object} token
 */
export async function createChatClient(token) {
  let client = null;
  try {
    client = await TwilioChat.create(token.jwt); // { logLevel: 'debug' }
  } catch (error) {
    console.log('twilio chat creat failed');
    console.dir(error);
  }
  return client;
}

/**
 * token 失效時更新
 * @param {object} client twilio client
 * @param {object} token
 */
export function tokenControl(client, token) {
  const accessManager = new AccessManager(token.jwt);
  accessManager.on('tokenUpdated', (am) => {
    console.log('renew updated');
    // get new token from AccessManager and pass it to the library instance
    client.updateToken(am.token);
  });
  accessManager.on('tokenExpired', () => {
    console.log('renew expired');
    // generate new token here and set it to the accessManager
    getToken(true)
      .then((newToken) => {
        accessManager.updateToken(newToken.jwt);
      }).catch(e => console.log('getToken failed', e));
  });

  return accessManager;
}

/**
 * 是否可顯示訊息
 * 1. 雙方對話
 * 2. 系統訊息
 * @param {object} message
 * @param {string} role 目前身份 1: 發案, 2: 接案
 */
export function isMessageAvailable(message, role, userId) {
  const isMemberMsg = !('sys_msg' in message.state.attributes);
  const isNewSystemMessageForUser = 'sys_msg' in message.state.attributes && message.state.author != userId && message.state.attributes.for === role;
  // const idOldMemberMessage = message.state.author != 'system';
  const idOldSystemMessageForUser = (message.state.author == 'system' && message.state.attributes.for && message.state.attributes && message.state.attributes.for === role);
  return isMemberMsg || isNewSystemMessageForUser || idOldSystemMessageForUser;
}

/**
 * 判斷是否為聊天狀態變更時的系統訊息
 * @param {object} message
 */
export function isDemandStepChanges(message) {
  if (isSystemMessage(message)) {
    const stepChangeType = [
      SYSTEM_MESSAGE.MESSAGE2.type,
      SYSTEM_MESSAGE.MESSAGE3.type,
      SYSTEM_MESSAGE.MESSAGE7.type,
      SYSTEM_MESSAGE.MESSAGE10.type,
      SYSTEM_MESSAGE.MESSAGE13.type,
      SYSTEM_MESSAGE.MESSAGE17.type
    ];
    const attributes = message.attributes;

    return stepChangeType.findIndex(type => attributes.type == type) > -1;
  }

  return false;
}

export function isDemandInDeskMenu(message, deskDemand) {
  const attributes = message.attributes;
  const { deskItem } = deskDemand;
  if ('demandId' in attributes) {
    return deskItem.findIndex(demand => demand.demandId == attributes.demandId) > -1;
  } else {
    return true;
  }
}

/**
 * 格式化訊息
 * @param {object} message twilio 訊息
 * @param {string} userId basic id
 * @param {object} deskDemand
 */
export function formatMessage(message, userId, deskDemand, areaCats) {
  const { deskItem } = deskDemand;
  let newMessage = Object.assign({}, message);
  const demand = deskItem.filter(temp => temp.demandId == newMessage.attributes.demandId);
  const messageDemand = demand[0];
  // console.log(messageDemand);

  if (messageDemand && 'demandAssignPlace' in messageDemand && messageDemand.demandAssignPlace && messageDemand.demandAssignPlace.length > 0) {
    try {
      const searchArea = catSearch(areaCats, messageDemand.demandAssignPlace);
      messageDemand.demandAssignPlaceDesc = searchArea.des;
    } catch (error) {
      messageDemand.demandAssignPlaceDesc = '否.';
    }
  } else if (messageDemand) {
    messageDemand.demandAssignPlaceDesc = '否';
  }

  if (demand.length > 0 && isSystemMessage(newMessage)) {
    formatSystemMessage(newMessage, messageDemand);
  }

  if (isMediaMessage(newMessage)) {
    newMessage.body = 'media';
  } else {
    newMessage.body = newMessage.body || '';
  }

  const messageData = {
    ...newMessage,
    me: newMessage.author === String(userId)
  };

  return messageData;
}

/**
 * 判斷是否為系統訊息
 * @param {object} message
 */
function isSystemMessage(message) {
  return message.attributes && 'type' in message.attributes && message.attributes.type.indexOf('system_msg') >= 0 && 'for' in message.attributes && Object.values(ROLE).find((element) => {
    return message.attributes.for == element;
  }) >= 0;
}

/**
 * 格式化系統訊息
 * @param {object} newMessage
 * @param {object} messageDemand
 */
function formatSystemMessage(newMessage, messageDemand) {
  switch (newMessage.attributes.type) {
    case SYSTEM_MESSAGE.MESSAGE1.type:
      formatSystemMessage1(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE2.type:
      formatSystemMessage2(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE2_2.type:
      formatSystemMessage18(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE3.type:
      formatSystemMessage3(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE4.type:
      formatSystemMessage4(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE5.type:
      formatSystemMessage5(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE6.type:
      formatSystemMessage6(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE7.type:
      formatSystemMessage7(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE8.type:
      formatSystemMessage8(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE9.type:
      formatSystemMessage9(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE10.type:
      formatSystemMessage10(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE11.type:
      formatSystemMessage11(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE12.type:
      formatSystemMessage12(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE13.type:
      formatSystemMessage13(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE14.type:
      formatSystemMessage14(newMessage, messageDemand);
      break;
    case SYSTEM_MESSAGE.MESSAGE15.type:
      formatSystemMessage15(newMessage);
      break;
    case SYSTEM_MESSAGE.MESSAGE16.type:
      formatSystemMessage16(newMessage);
      break;
    case SYSTEM_MESSAGE.MESSAGE17.type:
      formatSystemMessage17(newMessage, messageDemand);
      break;

    default:
      break;
  }
}

/**
 * 格式化系統訊息1
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage1(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `系統訊息：
    需求：${messageDemand.demandTitle}
    預算：${priceType[messageDemand.unit] === '時薪' ? '時薪' : '論件計酬'} NT$ ${moneyFormat(String(messageDemand.minPrice))}～${moneyFormat(String(messageDemand.maxPrice))}
    內容：${messageDemand.demandDesc}
    指定服務地點：${messageDemand.demandAssignPlaceDesc}
    ${messageDemand.educationalStage ? `教學對象：${targetTable[messageDemand.educationalStage]}` : ''}
    已將您以上需求通知發送邀請，若高手對需求有興趣進一步了解，訊息視窗狀會繼續開放對話。
    注意：高手若同意對話後，請於1個月內確認是否合作，若未回報合作，將會關閉對話功能。`;
  }

  if (message.attributes.for === ROLE.TOPPER && message.attributes.action_button == '' && messageDemand) {
    message.body = `對方訊息：
    您好，我有需求，邀請您進一步了解及詳談報價，需求簡述如下：
    需求：${messageDemand.demandTitle}
    預算：${priceType[messageDemand.unit] === '時薪' ? '時薪' : '論件計酬'} NT$ ${moneyFormat(String(messageDemand.minPrice))}～${moneyFormat(String(messageDemand.maxPrice))}
    內容：${messageDemand.demandDesc}
    指定服務地點：${messageDemand.demandAssignPlaceDesc}
    ${messageDemand.educationalStage ? `教學對象：${targetTable[messageDemand.educationalStage]}` : ''}
    `.trim();
  }

  if (message.attributes.for === ROLE.TOPPER && message.attributes.action_button == SYSTEM_MESSAGE.MESSAGE1.action_button) {
    message.body = `系統訊息：
    您是否有興趣進一步了解，若有興趣，請點選「繼續溝通」將對話，反之則點「無法接案」，我們將會通知案主，並關閉 此訊息視窗。`;
  }
}

/**
 * 格式化系統訊息2
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage2(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `系統訊息：
    高手對於需求：${messageDemand.demandTitle} 有興趣，同意繼續溝通更進一步了解，您可直接於下方開始繼續溝通，後續可於此需求之「溝通中」名單列表中找到專家並繼續對談，限1個月內需回報合作，若無合作則會自動關閉溝通。
    `;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `系統訊息：
    已通知案主，您同意繼續溝通了解，您可以主動詢問案主相關問題 或 等案主開始溝通。
    後續可於「進行中」案件列表內查到此需求，繼續溝通了解或報價。`;
  }
}

/**
 * 格式化系統訊息3
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage3(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER && message.attributes.action_button == SYSTEM_MESSAGE.MESSAGE3.action_button) {
    message.body = `系統訊息：
    高手對於需求：${messageDemand.demandTitle} 無法接案，此聊天室將無法繼續溝通，您可再重新查看其他高手。`;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `系統訊息：
    已通知案主，您無法接案，請案主聯絡其他人。`;
  }
}

/**
 * 格式化系統訊息4
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage4(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `系統訊息：
    需求：${messageDemand.demandTitle}
    內容：${messageDemand.demandDesc}
    指定服務地點：${messageDemand.demandAssignPlaceDesc}
    已將您以上需求通知發送給高手，你可與高手溝通討論後續合作事宜。
    注意：高手若同意對話後，請於1個月內確認是否合作，若未確認合作，將會關閉對話功能。`;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `對方訊息：
    我有另一個新的需求要與您討論溝通，需求簡述如下：
    需求：${messageDemand.demandTitle}
    內容：${messageDemand.demandDesc}
    指定服務地點：${messageDemand.demandAssignPlaceDesc}
    以上內容若有問題皆可以再與我討論。`;
  }
}

/**
 * 格式化系統訊息5
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage5(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `系統訊息：
    需求：${messageDemand.demandTitle}
    內容：${messageDemand.demandDesc}
    指定服務地點：${messageDemand.demandAssignPlaceDesc}
    已將您以上需求通知發送給高手，你可與高手溝通討論後結合作事宜。
    注意：高手若同意對話後，請於1個月內確認是否合作，若未確認合作，將會關閉對話功能。`;
  }

  if (message.attributes.for === ROLE.TOPPER && message.attributes.action_button == '') {
    message.body = `對方訊息：
    我有新的需求要與您討論溝通，需求簡述如下：
    需求：${messageDemand.demandTitle}
    內容：${messageDemand.demandDesc}
    指定服務地點：${messageDemand.demandAssignPlaceDesc}
    以上內容若有問題皆可以再與我討論。`;
  }

  if (message.attributes.for === ROLE.TOPPER && message.attributes.action_button == SYSTEM_MESSAGE.MESSAGE5.action_button) {
    message.body = `系統訊息：
    若此案您已與案主完成討論，且已決定要接案，請點選「確認合作」，反之則點「尚未確認合作」我們將會通知案主。`;
  }
}

/**
 * 格式化系統訊息6
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage6(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `系統訊息：
    您已提交 需求：${messageDemand.demandTitle} 合作回報給高手，待高手確認回覆雙方是否合作。若高手回覆「尚未合作」，可於後續再重新提交回報。
    請注意：若高手回報合作即不受1個月溝通期限之限制，反之則將會無法再繼續交談。`;
  }

  if (message.attributes.for === ROLE.TOPPER && message.attributes.action_button == '' && messageDemand) {
    message.body = `對方訊息：
    案主回報與您合作以下案件
    需求：${messageDemand.demandTitle}
    內容：${messageDemand.demandDesc}
    指定服務地點：${messageDemand.demandAssignPlaceDesc}`;
  }

  if (message.attributes.for === ROLE.TOPPER && message.attributes.action_button == SYSTEM_MESSAGE.MESSAGE6.action_button) {
    message.body = `系統訊息：
    請確認您是否與案主已完成溝通，且同意做後續服務。
    注意：確認合作後，則無30天的溝通限制，若未回報合作，將會關閉對話功能。`;
  }
}

/**
 * 格式化系統訊息7
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage7(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `系統訊息：
    高手已確認與您合作 需求：${messageDemand.demandTitle}。
    您們於結案前皆可以繼續交談。雙方合作時，為確保您的權益，請務必簽定相關合約。
    本網提供「各類合約範本」，您可自行由功能選單中進入查詢下載使用。
    後續可於此需求之「確認合作」名單列表中找到專家並繼續對談。`;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `系統訊息：
    已通知案主您已確認合作 需求：${messageDemand.demandTitle}。
    您們於結案前皆可以繼續交談。雙方合作時，為確保您的權益，請務必簽定相關合約。
    本網提供「各類合約範本」，您可自行由功能選單中進入查詢下載使用。`;
  }
}

/**
 * 格式化系統訊息8
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage8(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `系統訊息：
    高手尚未確認與您合作 需求：${messageDemand.demandTitle}。
    請再與高手繼續溝通並確認合作後，再次回報。。
    注意：若高手確認合作後，將無1個月的溝通限制，若未回報合作且無其他合作案件，將會於到期後關閉對話功能。`;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `系統訊息：
    已通知案主您尚未確認合作 需求：${messageDemand.demandTitle}。
    請您再與案主繼續溝通並確認合作後，再主動回報。
    注意：若確認合作後，將無30天的溝通限制，若未回報合作且無其他合作案件，將會於到期後關閉對話功能。`;
  }
}

/**
 * 格式化系統訊息9
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage9(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER && message.attributes.action_button == '') {
    message.body = `對方訊息：
    高手回報與您合作以下需求
    需求：${messageDemand.demandTitle}
    內容：${messageDemand.demandDesc}
    指定服務地點：${messageDemand.demandAssignPlaceDesc}`;
  }

  if (message.attributes.for === ROLE.DEMANDER && message.attributes.action_button == SYSTEM_MESSAGE.MESSAGE9.action_button) {
    message.body = `系統訊息：
    請確認是否與高手完成溝通，並同意由此高手為您後續的服務。
    注意：若確認合作後，將無1個月的溝通限制，若未回報合作，將會關閉對話功能。`;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `系統訊息：
    您已提交需求：${messageDemand.demandTitle} 合作回報給案主，待案主確認回覆雙方是否合作。若案主回覆「尚未合作」，可於後續確認後再重新提交回報。
    請注意：若案主回報合作即不受30天溝通期限之限制，反之則將會無法再繼續交談。`;
  }
}

/**
 * 格式化系統訊息10
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage10(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `系統訊息：
    已通知高手您已確認與高手合作案需求：${messageDemand.demandTitle}。
    您們於結案前皆可以繼續交談。雙方合作時，為確保您的權益，請務必簽定相關合約。 
    本網提供「各類合約範本」，您可自行由功能選單中進入查詢下載使用。
    後續可於此需求之「確認合作」名單列表中找到專家並繼續對談。`;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `系統訊息：
    案主已確認與您合作需求：${messageDemand.demandTitle}。
    您們於結案前皆可以繼續交談。雙方合作時，為確保您的權益，請務必簽定相關合約。
    本網提供「各類合約範本」，您可自行由功能選單中進入查詢下載使用。`;
  }
}

/**
 * 格式化系統訊息11
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage11(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `系統訊息：
    已通知高手您尚未確認與高手合作需求：${messageDemand.demandTitle}。
    請您再與高手繼續溝通並確認合作後，再主動回報。
    注意：若確認合作後，將無1個月的溝通限制，若未回報合作且無其他合作案件，將會於到期後關閉對話功能。`;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `系統訊息：
    案主尚未確認與您合作需求：${messageDemand.demandTitle}。
    請再與案主繼續溝通並確認合作後，再次回報。。
    注意：若確認合作後，將無30天的溝通限制，若未回報合作且無其他合作案件，將會於到期後關閉對話功能。`;
  }
}

/**
 * 格式化系統訊息12
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage12(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER && message.attributes.action_button == SYSTEM_MESSAGE.MESSAGE12.action_button) {
    message.body = `對方訊息：
    針對需求：${messageDemand.demandTitle}
    本次合作愉快，麻煩您花30秒，幫我累積一下評價/評論，讓我得以更進步，在此先感謝您。`;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `系統訊息：
    已通知並邀請案主，給予本次合作項目需求：${messageDemand.demandTitle} 的服務評價。`;
  }
}

/**
 * 格式化系統訊息13
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage13(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `系統訊息：
    感謝您完成評價，系統將會同步通知高手，您已針對需求：${messageDemand.demandTitle} 完成合作評價。
    若本需求已完成，且無需再與任何高手溝通，您可直接至「管理我的需求」本需求之管理列中點選【申請結案】，結案完成後，若有款項將會於14個工作天內刷退。`;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `系統訊息：
    案主已針對合作的需求：${messageDemand.demandTitle} 對你做了評價，您可自行進入您的品牌檔案之服務評價頁面查看。`;
  }
}

/**
 * 格式化系統訊息14
 * @param {object} message
 * @param {object} messageDemand
 */
function formatSystemMessage14(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER && message.attributes.action_button == SYSTEM_MESSAGE.MESSAGE14.action_button) {
    message.body = `系統訊息：
    針對已成交之需求：${messageDemand.demandTitle} 申請結案已完成。將關閉本需求與高手的所有對話功能。
    感謝您的使用，將關閉本需求與高手的所有對話功能。
    若與高手有其他案件溝通中，則仍可透過其他案件訊息視窗進入聯絡。
    若您此案件有支付押金，將會於14個工作天內退刷至付款之信用卡帳單內，因各銀行之退款處理的時不同，敬請注意近二期之帳單。`;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `系統訊息：
    案主已將需求：${messageDemand.demandTitle} 申請結案完成，並關閉本需求之對話功能。若您還有與案主有其他進行中案件，則不受影嚮。`;
  }
}

/**
 * 格式化系統訊息15
 * @param {object} message
 */
function formatSystemMessage15(message) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `系統訊息：
    您被檢舉案件異常將暫停聯絡，待重新審核，若有疑問請洽客服`;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `系統訊息：
    異常案件暫停聯絡，待重新審核，若有疑問請洽客服`;
  }
}

/**
 * 格式化系統訊息16
 * @param {object} message
 */
function formatSystemMessage16(message) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `系統訊息：
    高手合作異常將暫停聯絡，待重新審核，若有疑問請洽客服!`;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `系統訊息：
    您被檢舉合作異常將暫停聯絡，待重新審核，若有疑問請洽客服!`;
  }
}

/**
 * 格式化系統訊息17
 * @param {object} message
 */
function formatSystemMessage17(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `需求：${messageDemand.demandTitle}。
    確認合作高手人數已達最高限制人數5位，將無法再增加合作高手。
    此案件未合作高手將顯示於未合作列表中，若無其他溝通中或合作中案件，將關閉此聊天室。
    若有其他需求可發新案件邀請高手。`;
  }

  if (message.attributes.for === ROLE.TOPPER) {
    message.body = `需求：${messageDemand.demandTitle}。
    確認合作高手人數已達最高限制人數5位，將無法再增加合作高手。
    若您與案主無其他溝通中或合作中案件，將關閉此聊天室。`;
  }
}

/**
 * 格式化系統訊息2_2 高手主動「查閱」
 * @param {Object} message
 * @param {Object} messageDemand
 */
function formatSystemMessage18(message, messageDemand) {
  if (message.attributes.for === ROLE.DEMANDER) {
    message.body = `高手對您的案件：${messageDemand.demandTitle} 有興趣與您聯絡。
    你已可開始與高手利用此即時通系統溝通。
    建議你，可針對此案件做更進一步的說明，以利高手更清楚您的需求，讓後續的報價更明確。`;
  }
  if (message.attributes.for === ROLE.TOPPER && message.attributes.action_button == SYSTEM_MESSAGE.MESSAGE2_2.action_button) {
    message.body = `您主動查詢案件：${messageDemand.demandTitle} 聯絡資料，並已記錄。
    我們將會同步發送訊息給案主，您會主動與案主聯絡。
    你亦可使用本即時通系統與案主溝通，或後續回報合作及邀請評價功能。`;
  }
}

/**
 * 可上傳的檔案類型
 */
export const UPLOAD_ACCEPT_TYPE = '.jpeg,.jpg,.png,.gif,.xls,.xlsx,.ppt,.pptx,.doc,.docx';

export function isFileSizeValid(file) {
  return file.size && file.size > 0 && file.size <= 5 * 1048576;
}

function isMediaMessage(message) {
  return message && message.type && message.type == 'media';
}
