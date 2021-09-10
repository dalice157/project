const express = require('express');
const config = require('../config/config');
const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');

const router = express.Router();
const JAVA_URL = config.backend.domain;

// 查詢身分證字號/護照是否符合規範
router.post('/verify/verifyIdentity/:type/:identity', (req, res, next) => {
  const body = req.body;
  const who = req.user.basicId;
  restTools.callAPIPost(`${JAVA_URL}/verify/identity/${who}/{type}?type=${req.params.type}`, body, res);
});

// 寄出手機驗證瑪
router.post('/verify/sendVerifySMS', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body;
  logger.debug(`body.cellphone:${body.cellphone}`);

  restTools.callAPIPost(`${JAVA_URL}/verify/sendSMS/${who}`, body.cellphone, res);
});

// 行動電話驗證
router.post('/verify/verifyCellphone/:cellphone/:token', (req, res, next) => {
  const who = req.user.basicId;
  const verifyItem = {
    cellphone: req.params.cellphone,
    token: req.params.token,
  };
  restTools.callAPIPost(`${JAVA_URL}/verify/cellphone/${who}`, verifyItem, res);
});

module.exports = router;
