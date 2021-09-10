const express = require('express')
const config = require('../config/config');
// const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');

const router = express.Router();
const JAVA_URL = config.backend.domain;

// 取得登入資訊
router.get('/getInfo', (req, res, next) => {
  let user = req.user;
  //user.ssoTokenId 跟 CS 不一樣	
  if (true || !user.clientUser) {
    restTools.callAPIGet(`${JAVA_URL}/profile/info/${user.pid}?PI=${user.pid}&CS=${config.openIdSW ? req.user.sid : req.cookies.CS}`, null)
    .then(json => {      
      if (config.openIdSW && !user.basicId) {
        req.session.passport.user.basicId = json.id;
        // logger.debug('json', json);
        // req.session.passport.req.user.visitedTopActivePage = json.
      }
      if(user.impersonate_from) {
        json.userName = '(代)' + json.userName;
        json.diedn = 'true'; // 只為了標示代登用戶, 讓前端不作訊息讀取
      }

      req.session.passport.user.clientUser = json;
      req.session.passport.user.shouldCompleteInfo = json.shouldCompleteInfo;
      res.status(200).json(json)
    })
    .catch((error) => {
      let apiError = error.errors || { message: 'internal error' };
      res.status(error.status || 500).json({ 'error': apiError.message, 'sysMsgKey': error.sysMsgKey })
    });
  } else {
    res.status(200).json(user.clientUser);
  }
});

router.post('/signature', (req, res, next) => {
  const user = req.user;
  const body = req.body;
  restTools.callAPIPost(`${JAVA_URL}/signature?PI=${user.pid}&CS=${config.openIdSW ? req.user.sid : req.cookies.CS}`, body, res);
});

router.put('/reconvert/:fid', (req, res, next) => {
  const user = req.user;
  const body = req.body;
  restTools.callAPIPut(`${JAVA_URL}/reconvert/${req.params.fid}?PI=${user.pid}&CS=${config.openIdSW ? req.user.sid : req.cookies.CS}`, body, res);
});

router.get('/file-url/:fileId/:convertType', (req, res, next) => {
  const user = req.user;
  restTools.callAPIGet(`${JAVA_URL}/file-url/${req.params.fileId}/${req.params.convertType}?PI=${user.pid}&CS=${config.openIdSW ? req.user.sid : req.cookies.CS}`, res);
});

// 啟用 104高手 產品
router.post('/basic/active', (req, res, next) => {
  const body = req.body;
  const user = req.user;

  restTools.callAPIPost(`${JAVA_URL}/basic/active?PI=${user.pid}`, body.inputTopForm, null)
    .then((resp) => {
      if (resp.success) {
        req.session.passport.user.basicId = resp.data.basicId;
        req.session.passport.user.shouldCompleteInfo = false;
        req.session.passport.user.clientUser = null;
      }

      res.status(200).json(resp);
    })
    .catch((error) => {
      let apiError = error.errors || { message: 'internal error' };
      res.status(error.status || 500).json({ 'error': apiError.message, 'sysMsgKey': error.sysMsgKey })
    });
});

module.exports = router;