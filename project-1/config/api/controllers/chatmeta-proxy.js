const express = require('express')
const config = require('../config/config');
const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');

const router = express.Router();
const JAVA_URL = config.backend.domain;

/** IM聊天室 **/

// [需求者]選取需求，發送邀請給[高手]
router.post('/chat/inviteChat', (req, res) => {
  const who = req.user.basicId; // 需求者 id
  restTools.callAPIPut(`${JAVA_URL}/im/act/${who}/invite/${req.body.topperId}?demandIdItem=${req.body.demandIdList}`, req.body, res);
});

// [高手]同意[需求者]的邀請繼續溝通
router.post('/chat/acceptChat', (req, res) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/im/act/${who}/accept/${req.body.roomId}?demandId=${req.body.demandId}`, req.body, res);
});

// [高手]無法接案，拒絕[需求者]的邀請繼續溝通
router.post('/chat/rejectChat', (req, res) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/im/act/${who}/reject/${req.body.roomId}?demandId=${req.body.demandId}`, req.body, res);
});

// 選取案件邀請對方進行回報合作
router.post('/chat/askConfirm', (req, res) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/im/act/${who}/askConfirm/${req.body.roomId}?demandIdItem=${req.body.demandIdList}`, req.body, res);
});

// 對方所邀請的回報合作案件，確認合作
router.post('/chat/confirm', (req, res) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/im/act/${who}/confirm/${req.body.roomId}?demandIdItem=${req.body.demandIdList}`, req.body, res);
});

// 對方所邀請的回報合作案件，尚未確認合作
router.post('/chat/unconfirm', (req, res) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/im/act/${who}/unconfirm/${req.body.roomId}?demandIdItem=${req.body.demandIdList}`, req.body, res);
});

// [高手]選擇需求對應的服務項目，邀請[需求者]進行評價
router.post('/chat/askReview', (req, res, next) => {
  const who = req.user.basicId;
  const roomId = req.body.roomId;
  const reviewBody = req.body.reviewBody;
  
  restTools.callAPIPost(`${JAVA_URL}/im/act/${who}/askReview/${roomId}?askDescribe=${encodeURI(reviewBody.askDescribe)}&demandId=${reviewBody.demandId}&gigId=${reviewBody.gigId}`, reviewBody, res);
});

// [需求者]針對需求選定服務項目評價[高手]
router.post('/chat/reviewTopper', (req, res, next) => {
  const who = req.user.basicId;
  const roomId = req.body.roomId;
  const reviewBody = req.body.reviewBody;
  const gigId = reviewBody.gigId;
  
  restTools.callAPIPost(`${JAVA_URL}/im/act/${who}/writeReview/${roomId}?gigId=${gigId}`, reviewBody, res);
});

// [需求者]開放中的需求列表
router.get('/chat/demanderMenu', (req, res, next) => {
  const who = req.user.basicId;
  if(who) {
    restTools.callAPIGet(`${JAVA_URL}/im/demander/${who}/opt`, res);
  } else {
    res.status(200).json([]);
  }
});

// [需求者]針對需求列出各種合作狀態中的[高手]聊天室
router.get('/chat/demanderChatmeta/:deamndId', (req, res, next) => {
  const who = req.user.basicId;
  const cursor = req.query.cursor;
  if(who) {
    restTools.callAPIGet(`${JAVA_URL}/im/demanderChat/${who}/${req.params.deamndId}${cursor ? '?cursor=' + cursor : ''}`, res);
  } else {
    res.status(200).json({
      fileMap: null,
      total: null,
      start: null,
      preCursor: null,
      cursor: null,
      facets: null,
      data: [],
    });
  }
});

// [高手]合作中或收到溝通邀請的[需求者]聊天室
router.get('/chat/topperChatmetaV2', (req, res, next) => {
  const who = req.user.basicId;
  const cursor = req.query.cursor;
  if(who) {
    restTools.callAPIGet(`${JAVA_URL}/im/v2/topper/${who}${cursor ? '?cursor=' + cursor : ''}`, res);
  } else {
    res.status(200).json({
      total: null,
      cursor: null,
      preCursor: null,
      data: [],
    });
  }
});

// 聊天室進行中的需求
router.get('/chat/deskDemand/:roomId', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/im/v2/${req.params.roomId}/deskDemand/${who}`, res);
});

// [需求者]快速發送其他需求 - 選單
router.get('/chat/unInviteDemands/:topperId', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/im/opt/${who}/toBeInvite?topperId=${req.params.topperId}`, res);
});

// 可回報合作的需求列表
router.get('/chat/unConfirmDemands/:roomId', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/im/opt/${who}/toBeConfirm?roomId=${req.params.roomId}`, res);
});

// 成交評價時，可選取的服務項目
router.get('/chat/gigs/:basicId', (req, res, next) => {
  restTools.callAPIGet(`${JAVA_URL}/im/gig/opts/${req.params.basicId}`, res);
});


//TODO 在chat 新增案件對應的處理流程
// 付完款的交易處理
router.post('/chat/pay_success', (req, res, next) => {
  const body = req.body;
  const user = req.user;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPost(`${JAVA_URL}/paymentReceiver/no_sacrifice_no_victory?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}`, body, null)
  .then(json => {
    logger.debug('json',json);
    res.redirect('/chat?pay=success');
  })
  .catch(error => {
    res.redirect('/?pay=error');
  });  
});

// 付款未完成
router.post('/chat/pay_unfinished', (req, res, next) => {
  const body = req.body;
  const user = req.user;
  
  restTools.callAPIGet(`${JAVA_URL}/paymentCancel/${body.order_id}`, null)
  .then(json => {
    logger.debug('json',json);
    res.redirect(`/profile/${json.id}?pay=unfinished`);
  })
  .catch(error => {
    res.redirect('/?pay=error');
  });

  // res.redirect('/?pay=unfinished');  
});

/** 回饋相關API **/

/** 需求相關 API **/
// 新增需求
router.post('/chat/saveDemand', (req, res, next) => {
  // const who = req.user.basicId;
  const body = req.body;
  const user = req.user;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPost(`${JAVA_URL}/im/save/demand?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}&PI=${user.pid}`, body.demandBody, res);
});

// 修改需求
router.post('/chat/saveDemand/:demandId', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body;
  const user = req.user;
  restTools.callAPIPost(`${JAVA_URL}/im/save/demand/?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}&PI=${user.pid}&demandId=${req.params.demandId}`, body.demandBody, res);
});

// 填寫資料頁的預設資訊
router.get('/chat/defaultDemanderForm', (req, res, next) => {
  const who = req.user.basicId;
  const user = req.user;
  restTools.callAPIGet(`${JAVA_URL}/im/form/demander/${who}/default?PI=${user.pid}`, res);
});

// 啟用demander - step 2
router.post('/chat/activateDemander', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPost(`${JAVA_URL}/im/form/demander/${who}/submit`, body.demandVerifyForm, res);
});

// 繳納需求保證金
router.put('/chat/:partBId/paid/:demandId', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/im/paid/${who}?demandId=${req.params.demandId}&partBId=${req.params.partBId}`, null, res);
});

// 案主撰寫溝通評價
router.post('/feedback/saveDemanderSurvey', (req, res, next) => {
  const who = req.user.basicId;
  const ranking = req.body.ranking;
  restTools.callAPIPost(`${JAVA_URL}/feedback/survey/item/${who}`, ranking, res);
});

// 查看單一案件聯絡人資料
router.get('/chat/demandContactInfo/:demandId/:roomId', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/im/contact/${req.params.roomId}/${who}?demandId=${req.params.demandId}`, res);
});

// 由roomId 進IM, 情境由通知點入
router.get('/chat/room', (req, res, next) => {
  const who = req.user.basicId;
  const roomId = req.query.id;
  const keys = roomId.split('_');
  if (who == keys[1]) { //接案方事件
    res.redirect(`/api/login?pageRef=/chat?demanderId=${keys[0]}`);  
  } else { // TODO 多案件時,要再帶demandId
    res.redirect(`/api/login?pageRef=/chat?topperId=${keys[1]}`);
  }
});

// 退出聊天室 [高手]
router.delete('/chat/topper/leave/:roomIdList', (req, res) => {
  const who = req.user.basicId;
  const roomIdList = req.params.roomIdList.split(',');
  const roomIdListQueryString = roomIdList && roomIdList.length >= 1 && roomIdList.map(roomId => `roomIdList=${roomId}`).join('&');
  restTools.callAPIDel(`${JAVA_URL}/im/topper/leave/${who}?${roomIdListQueryString}`, res);
});

// 退出聊天室 [案主]
router.delete('/chat/demander/leave/:roomIdList', (req, res) => {
  const who = req.user.basicId;
  const roomIdList = req.params.roomIdList.split(',');
  const roomIdListQueryString = roomIdList && roomIdList.length >= 1 && roomIdList.map(roomId => `roomIdList=${roomId}`).join('&');
  restTools.callAPIDel(`${JAVA_URL}/im/demander/leave/${who}?${roomIdListQueryString}`, res);
});

// [高手]無法接案，拒絕[需求者]的 繼續溝通-邀請
router.put('/chat/denyNegotiating/:roomId/:isDeny', (req, res, next) => {
  const who = req.user.basicId;
  const roomId = req.params.roomId;
  const isDeny = req.params.isDeny || 'false';
  const queryString = `?isDeny=${isDeny}`;
  restTools.callAPIPut(`${JAVA_URL}/im/act/${who}/denyNegotiating/${roomId}${queryString}`, null, res);
});
module.exports = router;