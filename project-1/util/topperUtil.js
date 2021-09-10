// 高手 util


/**
 * 所有案件 - 下拉抽屜
 * @param {object[]} deskDemand
 */
export function getDrawerCase(deskItem) {
  return deskItem.filter(demand => ['1', '2', '3'].includes(demand.dealStep));
}

/**
 * 可回報合作的需求
 * @param {object[]} deskDemand
 */
export function getReportableDemands(deskItem) {
  return deskItem.filter(demand => ['1'].includes(demand.dealStep));
}

/**
 * 可邀請評價的需求
 * @param {object[]} deskDemand
 */
export function getEvaluableDemands(deskItem) {
  return deskItem.filter(demand => ['2'].includes(demand.dealStep));
}

/**
 * 判斷高手聯絡人群組
 */
export function shouldDisableAccordionItem(len) {
  return len === 0;
}
/**
 * 判斷高手聯絡人要展開的群組
 * @param {object[]} chatmetaByStatus
 * @param {object} demanderMeta
 */
export function shouldExpendAccordionItem(chatmetaByStatus = [{}], demanderMeta = {}) {
  return chatmetaByStatus.some(meta => meta.roomId == demanderMeta.roomId);
}

export function isDeamnderExistInChatmeta(topperChatmeta, demanderId) {
  return topperChatmeta.inviting.some(meta => meta.demanderId == demanderId)
    || topperChatmeta.processing.some(meta => meta.demanderId == demanderId);
}

export function isVip(user) { // 是否是vip
  return user && (user.freeToDeposit && user.freeToDeposit == true);
}

export function isFreeToDeposit(user, defaultProfileData) {
  return user && (user.freeToDeposit && user.freeToDeposit == true || defaultProfileData.toEasypay == false);
}
