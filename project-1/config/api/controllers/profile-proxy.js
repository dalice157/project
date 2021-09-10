const express = require('express')
const config = require('../config/config');
const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');

const router = express.Router();
const JAVA_URL = config.backend.domain;
const COOKIE_SECURE = config.app.env !== 'local'

// 新增 需求 - 包含成為需求者流程 Step1
// 不用 who 因第一次發案不會有 basicId
router.post('/profile/saveDemand', (req, res, next) => {
  // const who = req.user.basicId;
  const body = req.body;
  const user = req.user;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPost(`${JAVA_URL}/profile/save/demand?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}&PI=${user.pid}`, body.demandBody, null).then(json => {
    logger.info(user);
    if (!user.basicId) {
      user.basicId = json.data.basicId
      if (!config.openIdSW) {
        res.cookie('_topCS', JSON.stringify(user), { signed: true, httpOnly: true, secure: COOKIE_SECURE });
      }      
      logger.info(`使用者 pid: ${user.pid} 更新初始 basicId: ${user.basicId}`);
      // const msg = encodeURIComponent(`使用者 ${user.pid} 成功登入`);
    }
    return res.status(200).json(json);
  })
    .catch((error) => {
      let apiError = error.errors || { message: 'internal error' };
      res.status(error.status || 500).json({ 'error': apiError.message, 'sysMsgKey': error.sysMsgKey })
    });
});

// 修改需求
router.post('/profile/saveDemand/:demandId', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body;
  const user = req.user;
  restTools.callAPIPost(`${JAVA_URL}/profile/save/demand?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}&PI=${user.pid}&demandId=${req.params.demandId}`, body.demandBody, res);
});

// 填寫資料頁的預設資訊
router.get('/profile/form/defaultDemanderForm', (req, res, next) => {
  const who = req.user.basicId;
  const user = req.user;
  restTools.callAPIGet(`${JAVA_URL}/profile/form/demander/${who}/default?PI=${user.pid}`, res);
});

// 啟用demander - step 2
router.post('/profile/activateDemander', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPost(`${JAVA_URL}/profile/form/demander/${who}/submit`, body.demandVerifyForm, res);
});

// profile 繳納需求保證金
router.put('/profile/:partBId/paid/:demandId', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/profile/paid/${who}?demandId=${req.params.demandId}&partBId=${req.params.partBId}`, null, res);
});

module.exports = router;