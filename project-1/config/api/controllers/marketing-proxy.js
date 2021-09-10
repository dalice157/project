const express = require('express')
const config = require('../config/config');
const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');

const router = express.Router();
const JAVA_URL = config.backend.domain;

// 案件櫥窗
router.get('/demandWindow/get', (req, res, next) => {
  restTools.callAPIGet(`${JAVA_URL}/shopWindow/demand/get`, res);
  });

  module.exports = router;