const express = require('express')
const config = require('../config/config');
const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');

const router = express.Router();
const JAVA_URL = config.backend.domain;

router.get('/subscribe/get/v2', (req, res) => {
  const who = req.user.basicId;
  
  restTools.callAPIGet(`${JAVA_URL}/subscribe/get/v2?who=${who}`, res);
});

// 更新個人訂閱狀態 POST
router.post('/subscribe/update/v2', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body.subscribeDAO;
  restTools.callAPIPost(`${JAVA_URL}/subscribe/update/v2`, body, res);
});

module.exports = router;