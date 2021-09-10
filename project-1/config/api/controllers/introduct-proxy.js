const express = require('express')
const config = require('../config/config');
const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');

const router = express.Router();
const JAVA_URL = config.backend.domain;

// 新增收藏 PUT
router.put('/gig-introduct/add/:gigId', (req, res, next) => {
  const who = req.user.basicId;
  const gigId = req.params.gigId;
  restTools.callAPIPut(`${JAVA_URL}/gig-introduct/add/?gigId=${gigId}&who=${who}`, null, res);
});

// 刪除收藏 DELETE
router.delete('/gig-introduct/delete/:favoriteId', (req, res) => {
  const who = req.user.basicId;
  const favoriteId = req.params.favoriteId;
  restTools.callAPIDel(`${JAVA_URL}/gig-introduct/delete?favoriteId=${encodeURIComponent(favoriteId)}&who=${who}`, res);
});

// 新增使用者且收藏服務 PUT
router.put('/gig-introduct/newUserAdd/:gigId/:pid', (req, res, next) => {
  const gigId = req.params.gigId;
  const pid = req.params.pid;
  const body = req.body;
  restTools.callAPIPut(`${JAVA_URL}/gig-introduct/newUserAdd?gigId=${gigId}&pid=${pid}`, body, res);
});

// 填寫資料頁的預設資訊	
router.get('/gig-introduct/defaultDemanderForm', (req, res, next) => {
  const who = req.user.basicId;
  const user = req.user;
  restTools.callAPIGet(`${JAVA_URL}/gig-introduct/form/demander/${who}/default?PI=${user.pid}`, res);
});

// 啟用demander - step 2	
router.post('/gig-introduct/activateDemander', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPost(`${JAVA_URL}/gig-introduct/form/demander/${who}/submit`, body.demandVerifyForm, res);
});

// [需求者]快速發送其他需求 - 選單	
router.get('/gig-introduct/getInvitableDemands/:topperId', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/gig-introduct/opt/${who}/toBeInvite?topperId=${req.params.topperId}`, res);
});

// profile 繳納需求保證金	
router.put('/gig-introduct/:partBId/paid/:demandId', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/gig-introduct/paid/${who}?demandId=${req.params.demandId}&partBId=${req.params.partBId}`, null, res);
});


// 新增 需求 - 包含成為需求者流程 Step1	
// 不用 who 因第一次發案不會有 basicId	
router.post('/gig-introduct/saveDemand', (req, res, next) => {
  // const who = req.user.basicId;	
  const body = req.body;
  const user = req.user;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPost(`${JAVA_URL}/gig-introduct/save/demand?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}&PI=${user.pid}`, body.demandBody, null).then(json => {
    logger.info(user);
    if (!user.basicId) {
      user.basicId = json.data.basicId
      if (!config.openIdSW) {
        res.cookie('_topCS', JSON.stringify(user), {
          signed: true,
          httpOnly: true,
          secure: COOKIE_SECURE
        });
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
router.post('/gig-introduct/saveDemand/:demandId', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body;
  const user = req.user;
  restTools.callAPIPost(`${JAVA_URL}/gig-introduct/save/demand?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}&PI=${user.pid}&demandId=${req.params.demandId}`, body.demandBody, res);
});


module.exports = router; 