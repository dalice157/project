const express = require('express')
const config = require('../config/config');
const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');

const router = express.Router();
const JAVA_URL = config.backend.domain;
const COOKIE_SECURE = config.app.env !== 'local';


// 分頁列表紅點
router.get('/gigManage/get/watchDealList', (req, res, next) => {
  const who = req.user.basicId;
  const diedn = req.user.impersonate_from; // 代登不更新
  restTools.callAPIGet(`${JAVA_URL}/gigManage/get/${who}/watchDealList?dealStep=${diedn ? '0' : req.query.dealStep}`, res);
});

// 查閱案件列表
router.get('/gigManage/list/getContact', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gigManage/list/${who}/getContact?lastKey=${req.query.lastKey}&yearMonth=${req.query.yearMonth}`, res);
});

// 確認高手是否取消刊登
router.get('/gigManage/check/publish', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gigManage/check/${who}/publish`, res);
});

// 回報合作
router.put('/gigManage/reportCooperation', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/gigManage/${who}/reportCooperation?demandId=${req.query.demandId}&demanderId=${req.query.demanderId}&from=${req.query.from}`, null, res);
});

// 確認合作
router.put('/gigManage/confirmCooperation', (req, res, next) => {
  const who = req.user.basicId;
restTools.callAPIPut(`${JAVA_URL}/gigManage/${who}/confirmCooperation?demandId=${req.query.demandId}&demanderId=${req.query.demanderId}&from=${req.query.from}`, null, res);
});

// 前台 - 邀請評價時回傳選擇服務
router.get('/gigManage/titleList', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gigManage/${who}/titleList`, res);
});

// 前台 - 邀請評價時回傳選擇服務 (取得非本人的)
router.get('/gigManage/titleList/:basicId', (req, res, next) => {
  const basicId = req.params.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gigManage/${basicId}/titleList`, res);
});

// 邀請評價
router.put('/gigManage/askReview', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/gigManage/${who}/askReview?demandId=${req.query.demandId}&demanderId=${req.query.demanderId}&from=${req.query.from}&gigId=${req.query.gigId}`, null, res);
});

// 刷新單筆查閱紀錄資料
router.get('/gigManage/load/getContact', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gigManage/load/${who}/getContact`, res);
});

// 查看評價
router.get('/gigManage/getReview', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gigManage/${who}/getReview?demandId=${req.query.demandId}`, res);
});

// 查看聯絡人資料
router.get('/gigManage/getContact', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gigManage/${who}/getContact?demandId=${req.query.demandId}`, res);
});

// 接案主頁
router.get('/gigManage/dashboard/', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gigManage/dashboard/${who}`, res);
});

// 接案案主資訊
router.get('/gigManage/blockInfo/', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gigManage/blockInfo/${who}?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}`, res);
});

// 接案邀請中
router.get('/gigManage/invitingList/:lastKey', (req, res, next) => {
  const who = req.user.basicId;
  const lastKey = req.params.lastKey;
  const queryString = lastKey !== 'initial' ? `?lastKey=${lastKey}` : '';
  restTools.callAPIGet(`${JAVA_URL}/gigManage/list/${who}/inviting${queryString}`, res);
});

// 同意溝通
router.put('/gigManage/communicate/:demandId/:demanderId', (req, res, next) => {
  const who = req.user.basicId;
  const demandId = req.params.demandId;
  const demanderId = req.params.demanderId;
  restTools.callAPIPut(`${JAVA_URL}/gigManage/${who}/communicate?demandId=${demandId}&demanderId=${demanderId}`,null, res);
});

// 無法接案
router.put('/gigManage/reject/:demandId/:demanderId', (req, res, next) => {
  const who = req.user.basicId;
  const demandId = req.params.demandId;
  const demanderId = req.params.demanderId;
  restTools.callAPIPut(`${JAVA_URL}/gigManage/${who}/reject?demandId=${demandId}&demanderId=${demanderId}`,null, res);
});

// 接案溝通中
router.get('/gigManage/communicatingList/:lastKey', (req, res, next) => {
  const who = req.user.basicId;
  const lastKey = req.params.lastKey;
  const queryString = lastKey !== 'initial' ? `?lastKey=${lastKey}` : '';
  restTools.callAPIGet(`${JAVA_URL}/gigManage/list/${who}/communicating${queryString}`, res);
});

// 主應列表
router.get('/gigManage/list/quotation', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gigManage/list/${who}/quotation?lastKey=${req.query.lastKey}&yearMonth=${req.query.yearMonth}`, res);
});

// 已結案列表
router.get('/gigManage/list/closed', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gigManage/list/${who}/closed?lastKey=${req.query.lastKey}&yearMonth=${req.query.yearMonth}`, res);
});


// 合作中列表
router.get('/gigManage/list/cooperating', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gigManage/list/${who}/cooperating?lastKey=${req.query.lastKey}`, res);
});

// 付費紀錄
router.get('/gigManage/paidRecord', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gigManage/${who}/paidRecord`, res);
});

module.exports = router;
