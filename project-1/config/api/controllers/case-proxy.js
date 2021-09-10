const express = require('express');
const config = require('../config/config');
const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');

const router = express.Router();
const JAVA_URL = config.backend.domain;


// 案件內容頁-我要應徵
router.put('/case/add/:basicId/:demandId/applier', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/case/add/${req.params.basicId}/${req.params.demandId}/applier?gigId=${req.query.gigId}&who=${who}`, null, res);
});

// 案件內容頁-主應後 取得可用權益
router.get('/case/bargainingPower/:demandId', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/case/bargainingPower/${req.params.demandId}/${who}`, res);
});

// 需求內容頁 -主應後 取得聯絡方式，已取得聯絡人資料可重複查閱
router.put('/case/getContacts', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/case/getContacts/${req.query.demandId}/${who}?useIm=${req.query.useIm}`, null, res);
});

// 產生沒有聊天室的dealMeta之後的補償，目前僅補dealMeta在邀請及溝通中的情況
router.put('/case/makeUpChatMeta', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/case/makeUpChatMeta/${req.query.demandId}/${who}`, null, res);
});

// 列出某高手的gig資料
router.get('/case/gig', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gig/${who}?demandId=${req.query.demandId}`, res);
});


module.exports = router;
