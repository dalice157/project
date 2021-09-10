// 案主 util

/**
 * 是否為案主
 * @param {object} user
 */
export function isRoleDemander(user) {
  const metaExist = !(user.meta == null || user.meta == undefined);
  const demanderExist = metaExist && !(user.meta.demander == null || user.meta.demander == undefined);
  const isDemander = demanderExist && user.meta.demander;

  return isDemander;
}

/**
 * 判斷案主聯絡人群組
 */
export function shouldDisableAccordionItem(len) {
  return len === 0;
}
/**
 * 判斷案主聯絡人要展開的群組
 * @param {object[]} chatmetaByStatus
 * @param {object} topperMeta
 */
export function shouldExpendAccordionItem(chatmetaByStatus = [{}], topperId = '') {
  return chatmetaByStatus.length > 0 && chatmetaByStatus.some(meta => meta.topperId == topperId); // || chatmetaByStatus.length > 0
}

/**
 * 可邀請評價的需求
 * @param {object[]} deskDemand
 */
export function getEvaluableDemands(deskItem) {
  return deskItem.filter(demand => ['2'].includes(demand.dealStep));
}
