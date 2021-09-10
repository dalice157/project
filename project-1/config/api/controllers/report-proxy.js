const express = require('express')
const config = require('../config/config');
const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');

const router = express.Router();
const JAVA_URL = config.backend.domain;

// 取得 user 的違規紀錄
router.get('/report/getReportRecord', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/report/chk/reportRec/${who}`, res);
});

// 取得 user 的違規紀錄
router.get('/report/getOtherReportRecord/:basicId', (req, res, next) => {
  const basicId = req.params.basicId;
  restTools.callAPIGet(`${JAVA_URL}/report/chk/reportRec/${basicId}`, res);
});

// 取得 [高手] 檢舉 [需求者] 時所需的Demand清單
router.get('/report/getReportList/:demanderId', (req, res, next) => {
  const who = req.user.basicId;
  console.log(`${JAVA_URL}/report/getReportList/${who}/${req.params.demanderId}`);
  
  restTools.callAPIGet(`${JAVA_URL}/report/getReportList/${who}/${req.params.demanderId}`, res);
});

// 檢舉
router.post('/report/reportTarget', (req, res, next) => {
  const body = req.body;
  restTools.callAPIPost(`${JAVA_URL}/report/reportHim`, body.reportBody, res);
});

module.exports = router;