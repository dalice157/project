const express = require('express')
const config = require('../config/config');
const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');

const router = express.Router();
const JAVA_URL = config.backend.domain;
const COOKIE_SECURE = config.app.env !== 'local';

// 案主主動邀請列表
router.get('/demand/list/invitedTopper/:demandId/:filterType/:lastKey', (req, res, next) => {
  const who = req.user.basicId;
  const demandId = req.params.demandId;
  const filterType = req.params.filterType || 0;
  const cursor = req.params.lastKey !== 'initial' ? `&cursor=${req.params.lastKey}` : '';
  const queryString = `demandId=${demandId}&filterType=${filterType}${cursor}&pageSize=20`;
  restTools.callAPIGet(`${JAVA_URL}/demand/list/invitedTopper/${who}?${queryString}`, res);
});

// 應徵高手列表
router.get('/demand/list/quotation/:demandId/:filterType/:lastKey', (req, res, next) => {
  const who = req.user.basicId;
  const demandId = req.params.demandId;
  const filterType = req.params.filterType;
  const lastKey = req.params.lastKey;
  const queryString = `demandId=${demandId}&filterType=${filterType ? filterType : 0}${lastKey !== 'initial' ? `&lastKey=${lastKey}` : ''}`;
  restTools.callAPIGet(`${JAVA_URL}/demand/list/quotation/${who}?${queryString}`, res);
});

// 邀請評價時回傳選擇服務
router.get('/demand/gigTitleList/:topperId', (req, res, next) => {
  const topperId = req.params.topperId;
  restTools.callAPIGet(`${JAVA_URL}/demand/${topperId}/gigTitleList`, res);
});

// 同意溝通
router.put('/demand/receiveApply/:demandId/:topperId', (req, res, next) => {
  const who = req.user.basicId;
  const demandId = req.params.demandId;
  const topperId = req.params.topperId;
  restTools.callAPIPut(`${JAVA_URL}/demand/${who}/${demandId}/receiveApply/${topperId}`, null, res);
});

// 邀請合作
router.put('/demand/reportCooperation/:demandId/:topperId', (req, res, next) => {
  const who = req.user.basicId;
  const demandId = req.params.demandId;
  const topperId = req.params.topperId;
  restTools.callAPIPut(`${JAVA_URL}/demand/${who}/${demandId}/reportCooperation/${topperId}`, null, res);
});

// 確認合作
router.put('/demand/confirmCooperation/:demandId/:topperId', (req, res, next) => {
  const who = req.user.basicId;
  const demandId = req.params.demandId;
  const topperId = req.params.topperId;
  restTools.callAPIPut(`${JAVA_URL}/demand/${who}/${demandId}/confirmCooperation/${topperId}`, null, res);
});

// 案主評價
router.post('/demand/writeReview/:topperId/:gigId', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body;
  const gigId = req.params.gigId;
  const topperId = req.params.topperId;
  restTools.callAPIPost(`${JAVA_URL}/demand/${who}/writeReview/${topperId}?gigId=${gigId}`, body.demandBody, res);
});

// 產生沒有聊天室的dealMeta之後的補償，目前僅補dealMeta在邀請及溝通中的情況
router.put('/demand/makeUpChatMeta/:demandId/:topperId', (req, res, next) => {
  const demandId = req.params.demandId;
  const topperId = req.params.topperId;
  restTools.callAPIPut(`${JAVA_URL}/demand/makeUpChatMeta/${demandId}/${topperId}`, null, res);
});

// 應徵高手列表
router.get('/demand/title/:demandId', (req, res, next) => {
  const who = req.user.basicId;
  const demandId = req.params.demandId;
  restTools.callAPIGet(`${JAVA_URL}/demand/title/${who}/${demandId}`, res);
});

// [需求者]快速發送其他需求 - 選單
router.get('/profile/getInvitableDemands/:topperId', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/profile/opt/${who}/toBeInvite?topperId=${req.params.topperId}`, res);
});

// 需求列表
router.get('/demand/list/:page', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/demand/list/${who}?page=${req.params.page}`, res);
});

// 需求列表 - 選擇狀態
router.get('/demand/list/:selectOpt/:page', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/demand/list/${who}/${req.params.selectOpt}?page=${req.params.page}`, res);
});

router.post('/demand/saveDemandV2', (req, res, next) => {
  // const who = req.user.basicId;
  const body = req.body;
  const user = req.user;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPost(`${JAVA_URL}/demand/save/v2?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}&PI=${user.pid}`, body.demandBody, null).then(json => {
    if (!user.basicId) {
      user.basicId = json.data.basicId
      if (!config.openIdSW) {
        res.cookie('_topCS', JSON.stringify(user), { signed: true, httpOnly: true, secure: COOKIE_SECURE });
      }
      logger.info(`使用者 ${user.pid} 更新初始`);
      // const msg = encodeURIComponent(`使用者 ${user.pid} 成功登入`);
    }
    return res.status(200).json(json);
  })
    .catch((error) => {
      let apiError = error.errors || { message: 'internal error' };
      res.status(error.status || 500).json({ 'error': apiError.message, 'sysMsgKey': error.sysMsgKey })
    });
});

// 新版案件刊登 step 1 案件內容填寫
router.post('/demand/saveDemandv2/:demandId', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body;
  const user = req.user;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPost(`${JAVA_URL}/demand/save/v2?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}&PI=${user.pid}&demandId=${req.params.demandId}`, body.demandBody, res);
});

// 新版案件刊登 step1 or 編輯頁面 - 編輯案件時，取得已儲存資料 已結案不可修改
router.get('/demand/getSaved/:demandId', (req, res, next) => {
  const who = req.user.basicId;
  const demandId = req.params.demandId;
  restTools.callAPIGet(`${JAVA_URL}/demand/getSaved?demandId=${demandId}&who=${who}`, res);
});

// 新版案件刊登 step2 從AC取得信箱、室話、手機，及驗證狀況
router.get('/demand/getDemanderInfo/:demandId', (req, res, next) => {
  const who = req.user.basicId;
  const user = req.user;
  const demandId = req.params.demandId;
  restTools.callAPIGet(`${JAVA_URL}/demand/solution/${who}/default?PI=${user.pid}${demandId !== 'undefined' ? '&demandId='.concat(demandId) : ''}`, res);
});

// 新版案件刊登 step 2 送出刊登方案表單、將新的驗證資料回寫AC
router.post('/demand/submitDemanderPlan', (req, res, next) => {
  const who = req.user.basicId;
  const user = req.user;
  const body = req.body;
  // 線上的內部人員送審將不分派
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const internal = (config.app.env === 'production' && ip === '60.251.45.137')  ? '&isInternalStaff=true' : '';
  restTools.callAPIPost(`${JAVA_URL}/demand/solution/${who}/submit?PI=${user.pid}${internal}`, body.demandVerifyForm, res);
});

// 舊版案件刊登 AC會員資料、高手手機讀取
router.get('/demand/defaultDemanderForm', (req, res, next) => {
  const who = req.user.basicId;
  const user = req.user;
  restTools.callAPIGet(`${JAVA_URL}/demand/form/demander/${who}/default?PI=${user.pid}`, res);
});

// 舊版案件刊登 帳戶資料確認
router.post('/demand/checkAccount/', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPost(`${JAVA_URL}/demand/form/demander/${who}/submit`, body.demandVerifyForm, res);
});

// 填寫資料頁的預設資訊
router.get('/demand/defaultDemanderForm', (req, res, next) => {
  const who = req.user.basicId;
  const user = req.user;
  restTools.callAPIGet(`${JAVA_URL}/demand/form/demander/${who}/default?PI=${user.pid}`, res);
});

// 啟用demander - step 2
router.post('/demand/activateDemander', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPost(`${JAVA_URL}/demand/form/demander/${who}/submit`, body.demandVerifyForm, res);
});

//需求繳納需求保證金
router.put('/demand/paid/:demandId', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/demand/paid/${who}?demandId=${req.params.demandId}`, null, res);
});

// demand付完款的交易處理
router.post('/demand/pay_success', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body;
  const user = req.user;
  const orderId = body.orders;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPost(`${JAVA_URL}/paymentReceiver/no_sacrifice_no_victory?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}`, body, null)
    .then(response => {
      logger.debug(`paymentReceiver json->${JSON.stringify(response, null, 2)}`);
      return restTools.callAPIGet(`${JAVA_URL}/payment/getDemandOrder?orderId=${orderId}&who=${who}`, null)
    })
    .then(response => {
      // 成功支付金流
      logger.debug(`demandOrder->${JSON.stringify(response, null, 2)}`);
      const demandId = response.targetId;
      res.redirect(`/finished?pay=success&demandId=${demandId}&planType=1`);
    })
    .catch(error => {
      logger.error(`getDemandOrder error->${JSON.stringify(error, null, 2)}`);
      res.redirect('/demand?pay=error');
    });
});

// demand付款未完成
router.post('/demand/pay_unfinished', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body;
  const orderId = body.orders;
  restTools.callAPIGet(`${JAVA_URL}/payment/getDemandOrder?orderId=${orderId}&who=${who}`, null)
    .then(response => {
      logger.debug(`demandOrder->${JSON.stringify(response, null, 2)}`);
      const demandId = response.targetId;
      res.redirect(`/planSelect?pay=unfinished&demandId=${demandId}`);
    })
    .catch(error => {
      logger.error('getDemandOrder error->', JSON.stringify(error, null, 2));
      res.redirect('/demand?pay=error');
    });
});

// 案件結案
router.put('/demand/close/:demandId/:closeReason', (req, res, next) => {
  const who = req.user.basicId;
  const body = req.body || [];
  restTools.callAPIPut(`${JAVA_URL}/demand/close/${who}/${req.params.demandId}?closeReason=${req.params.closeReason}`, body, res);
});

// 需求 - 申請展延到期日
router.put('/demand/extend/:demandId', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/demand/extend/${who}?demandId=${req.params.demandId}`, null, res);
});

// 修改案件聯絡人電話公開設定
router.put('/demand/phoneDisplay/:demandId/:display', (req, res, next) => {
  const { demandId, display } = req.params;
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/demand/phoneDisplay/${who}/${demandId}?display=${display}`, null, res);
});

module.exports = router;