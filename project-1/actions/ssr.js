import {
  getContent, queryGigs, loadStaticArea, loadGigDetail, loadSelfAchievement, getBasic, getProfileGigs, loadBlockInfo, loadReviewCheck, loadTopperIntro, queryDemandList
} from './common';
import { isNumber } from '../util/commonUtil';
/**
 * 服務專頁: /service
 */
export const initialService = async (store, basicId, gigId) => {
  const isBasicIdValid = isNumber(basicId);
  const actions = [loadStaticArea()];
  if (isBasicIdValid) {
    actions.push(
      loadGigDetail(basicId, gigId),
      loadSelfAchievement(basicId),
    );
  }
  await store.dispatch((dispatch => Promise.all(actions.map(action => dispatch(action)))));
};
/**
 * 案件頁: /caseInfo
 */
export const initialCaseInfo = async (store, basicId, demandId) => {
  const isBasicIdValid = isNumber(basicId);
  const actions = [loadStaticArea()];
  if (isBasicIdValid) {
    actions.push(getContent(basicId, demandId));
  }
  await store.dispatch((dispatch => Promise.all(actions.map(action => dispatch(action)))));
};
/**
 * 案件頁: /profile
 */
export const initialProfile = async (store, basicId, topperId, quotationId) => {
  const isBasicIdValid = isNumber(basicId);
  const actions = [loadStaticArea()];
  if (isBasicIdValid) {
    actions.push(
      getBasic(basicId),
      loadBlockInfo(basicId),
      loadReviewCheck(basicId),
      getProfileGigs(basicId),
      loadTopperIntro(basicId),
    );
  }
  if (isBasicIdValid && quotationId) { // 存在表示從主應信來
    await fetch(`/api/view/quotation?basicId=${topperId}&quotationId=${quotationId}`);
  }
  await store.dispatch((dispatch => Promise.all(actions.map(action => dispatch(action)))));
};
/**
 * 服務搜尋頁: /search
 */
export const initGigList = async (store, location) => {
  const actions = [
    loadStaticArea(),
    queryGigs('?' + location.search),
  ];
  await store.dispatch((dispatch => Promise.all(actions.map(action => dispatch(action)))));
};
/**
 * 案件搜尋頁: /caseList
 */
export const initCaseList = async (store, location) => {
  const actions = [
    loadStaticArea(),
    queryDemandList('?' + location.search),
  ];
  await store.dispatch((dispatch => Promise.all(actions.map(action => dispatch(action)))));
};
