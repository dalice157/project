const express = require('express');

const config = require('../config/config');
const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');
const csurf = require('csurf');

const csrfProtection = csurf({ cookie: { secure: true } });

const router = express.Router();
const JAVA_URL = config.backend.domain;
const COOKIE_SECURE = config.app.env !== 'local';



/** 成為高手 * */

// 填寫資料頁的預設資訊
router.get('/basic/defaultProfile', (req, res, next) => {
  let user = req.user;
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/basic/form/default/topper/${who}?PI=${user.pid}`, res);
});

// 新增/更新會員 GIGs
router.post('/basic/gig', csrfProtection, (req, res) => {
  const who = req.user.basicId;
  const allowedOrigins = ['http://top.localhost:3000', 'https://top.104-dev.com.tw', 'https://top.104-staging.com.tw', 'https://top.104.com.tw'];
  const url = new URL(req.headers.referer);

  if (!allowedOrigins.includes(url.origin)) {
    res.status(403);
    res.end();
  } else {
    restTools.callAPIPost(`${JAVA_URL}/basic/gig/${who}`, req.body.gigs, res);
  }
});

// 取得會員 GIGs
router.get('/basic/gig', csrfProtection, (req, res, next) => {
  // console.log(req.user);
  const who = req.user.basicId;
  // console.log(`取得會員 GIGs: ${JAVA_URL}/basic/gig/${who}`);
  restTools.callAPIGet(`${JAVA_URL}/basic/gig/${who}`, null).then((json) => {
    res.status(200).json({ ...json, _csrf: req.csrfToken() })
  });
});

// 刪除會員 GIGs
router.delete('/basic/gig/:gigId', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIDel(`${JAVA_URL}/basic/gig/${req.params.gigId}/${who}`, res);
});

// 建立Topper 的 BasicId, 啟用Cprofile品牌頁
router.post('/basic/importTopperProfile/:source', (req, res, next) => {
  // source: new, plus, my104, tutor, outsource
  const who = req.user.basicId;
  const user = req.user;
  restTools.callAPIPost(`${JAVA_URL}/basic/build/cprofile/${who}/${req.params.source}?PI=${user.pid}&CS=${config.openIdSW ? req.user.sid : req.cookies.CS}`, null)
    .then((json) => {
      user.basicId = json.id;
      if (!config.openIdSW) {
        res.cookie('_topCS', JSON.stringify(user), { signed: true, httpOnly: true, secure: COOKIE_SECURE });
      }
      req.session.passport.user.clientUser = null; // 刷新user cache
      res.status(200).json(json);
    })
    .catch((error) => {
      let apiError = error.errors || { message: 'internal error' };
      res.status(error.status || 500).json({ error: apiError.message, sysMsgKey: error.sysMsgKey });
    });
});

// 取得匯入履歷的來源選項
router.get('/basic/import/sourceList', (req, res, next) => {
  let user = req.user;
  restTools.callAPIGet(`${JAVA_URL}/basic/import/sourceList?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}&PI=${user.pid}`, res);
});

// 取得舊站的成交評鑑資料
router.get('/basic/info/deal', (req, res, next) => {
  let user = req.user;
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/basic/info/deal/${who}`, res);
});

// 立即發佈 (已付保證金)
router.put('/basic/publish', (req, res, next) => {
  const body = req.body;
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/basic/publish/${who}?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}`, null, res);
});

// 支付保證金
router.put('/basic/promise', (req, res, next) => {
  const body = req.body;
  const who = req.user.basicId;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPut(`${JAVA_URL}/basic/promise/v2/${who}`, body, res);
});

// 付完款的交易處理
router.post('/basic/pay_success', (req, res, next) => {
  const body = req.body;
  req.session.passport.user.clientUser = null; // 刷新user cache

  restTools.callAPIPost(`${JAVA_URL}/paymentReceiver/no_sacrifice_no_victory?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}`, body, null)
    .then((json) => {
      console.log(json);
      logger.debug('json', json);
      res.redirect('/shareSetting?pay=success');// 付費
    })
    .catch((error) => {
      console.log(error);
      logger.debug('json', error);
      res.redirect('/?pay=error');
    });
});

// 接案者 - 新手體驗方案
router.post('/basic/chargeTopperFree', (req, res, next) => {
  const body = req.body;
  const user = req.user;
  const who = req.user.basicId;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIPost(`${JAVA_URL}/payment/receiver/topperFree/v2/no_sacrifice_no_victory?who=${who}&CS=${config.openIdSW ? req.user.sid : req.cookies.CS}`, body, res);
});

// 紀錄蛋黃會員是否去過 edit 頁面
router.put('/basic/yolkmember/beenEdit', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIPut(`${JAVA_URL}/basic/yolkmember/beenEdit?who=${who}`, null, res);
});

// 付款未完成
router.post('/basic/pay_unfinished', (req, res, next) => {
  const body = req.body;
  const user = req.user;

  // restTools.callAPIPost(`${JAVA_URL}/paymentReceiver/no_sacrifice_no_victory?CS=${req.cookies.CS}`, body, null)
  // .then(json => {
  //   console.log(json);
  //   logger.debug('json',json);
  //   res.redirect('/shareSetting?pay=success');
  // })
  // .catch(error => {
  //   res.redirect('/?pay=error');
  // });

  res.redirect('/editProfile?pay=unfinished');
});


// 取消刊登-Step1.取消刊登品牌頁
router.get('/basic/getCancel', (req, res, next) => {
  const who = req.user.basicId;
  req.session.passport.user.clientUser = null; // 刷新user cache
  restTools.callAPIGet(`${JAVA_URL}/basic/cancel/${who}`, res);
});

// 取消刊登-Step2.取消刊登並申退保證金
router.put('/basic/cancel', (req, res, next) => {
  const who = req.user.basicId;
  const reason = encodeURIComponent(req.query.reason.trim().replace(/\r\n|\n/g, ''));
  restTools.callAPIPut(`${JAVA_URL}/basic/cancel/${who}?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}&cancelSubscription=${req.query.cancelSubscription}&reason=${reason}&reasonOpt=${req.query.reasonOpt}`, null, res);
});

// 取消刊登-Step3.繼續公開/取消公開 CProfile的資料
router.put('/basic/plusPublish/:act', (req, res, next) => {
  const user = req.user;
  restTools.callAPIPut(`${JAVA_URL}/basic/plusPublish/${req.params.act}?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}&PI=${user.pid}`, null, res);
});

// 確認 已付保證金但未公開plus 狀態
router.get('/basic/plusShare', (req, res, next) => {
  const user = req.user;
  restTools.callAPIGet(`${JAVA_URL}/basic/plusShare?CS=${config.openIdSW ? req.user.sid : req.cookies.CS}&PI=${user.pid}`, res);
});

// 聊天室未讀訊息
router.get('/basic/im/unread', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/basic/im/unread/${who}`, res);
});

// 個人檔案 發布檢查
router.get('/basic/publish/check', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/basic/publish/check?who=${who}`, res);
});

// 取得高手產品啟用頁的預設資訊
router.get('/basic/form/default', (req, res, next) => {
  const user = req.user;
  restTools.callAPIGet(`${JAVA_URL}/basic/form/default/${user.pid}`, res);
});

// 取得案件Order
router.get('/basic/getDemandOrder/:orderId', (req, res, next) => {
  const who = req.user.basicId;
  const orderId = req.params.orderId;
  restTools.callAPIGet(`${JAVA_URL}/payment/getDemandOrder?orderId=${orderId}&who=${who}`, res);
});

// 選擇付費方案前，取得會員的折扣資訊、預設的發票資訊
router.get('/basic/payment/prePaymentInfo/v2', csrfProtection, (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/payment/prePaymentInfo/${who}/v2`, null).then((json) => {
    res.status(200).json({ ...json, _csrf: req.csrfToken() });
  })
    .catch((error) => {
      let apiError = error.errors || { message: 'internal error' };
      res.status(error.status || 500).json({ 'error': apiError.message, 'sysMsgKey': error.sysMsgKey })
    });
});

// 付費超值方案升級，取得差額及可升級的方案
router.get('/basic/payment/preUpgradePlanInfo', csrfProtection, (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/payment/preUpgradePlanInfo/${who}`, null).then((json) => {
    res.status(200).json({ ...json, _csrf: req.csrfToken() });
  })
    .catch((error) => {
      let apiError = error.errors || { message: 'internal error' };
      res.status(error.status || 500).json({ 'error': apiError.message, 'sysMsgKey': error.sysMsgKey })
    });
});

// 建立高手訂單、MIS訂單
router.post('/basic/payment/createPaymentOrder', (req, res, next) => {
  const body = req.body;
  const who = req.user.basicId;
  // req.uest.id_token -> 跟MIS互動需要用id_token
  restTools.callAPIPost(`${JAVA_URL}/payment/createPaymentOrder/no_sacrifice_no_victory/${who}?idToken=${req.user.id_token}&sid=${req.user.sid}`, body, res);
});

// 建立高手升級方案訂單、MIS訂單
router.post('/basic/payment/createUpgradeOrder', (req, res, next) => {
  const body = req.body;
  const who = req.user.basicId;
  // req.uest.id_token -> 跟MIS互動需要用id_token
  restTools.callAPIPost(`${JAVA_URL}/payment/createUpgradeOrder/no_sacrifice_no_victory/${who}?idToken=${req.user.id_token}&sid=${req.user.sid}`, body, res);
});

// 付費刊期訂單 - MIS付款流程完成後的交易處理
router.put('/basic/payment/paymentOrderReceiver', csrfProtection, (req, res, next) => {
  const allowedOrigins = ['http://top.localhost:3000', 'https://top.104-dev.com.tw', 'https://top.104-staging.com.tw', 'https://top.104.com.tw'];
  const url = new URL(req.headers.referer);

  if (!allowedOrigins.includes(url.origin)) {
    res.status(403);
    res.end();
  } else {
    const body = req.body;
    const who = req.user.basicId;
    req.session.passport.user.clientUser = null; // 刷新user cache
    logger.info('cache:', req.session.passport.user.clientUser)
    // req.user.sid -> 付款流程結束，進行profile發布，跟CProfile互動需要用sid
    restTools.callAPIPut(`${JAVA_URL}/payment/paymentOrderReceiver/no_sacrifice_no_victory/${who}?CS=${req.user.sid}`, body, null).then((resp) => {
      if (resp.success) {
        req.session.passport.user.clientUser = null;
      }
      res.status(200).json(resp);
    })
      .catch((error) => {
        let apiError = error.errors || { message: 'internal error' };
        res.status(error.status || 500).json({ 'error': apiError.message, 'sysMsgKey': error.sysMsgKey })
      });;
  }

});

// 查看測試帳號
router.get('/basic/testAccount', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/basic/check/testAccount/${who}`, res);
});

// 確認BMDM的發票抬頭與號碼
router.put('/basic/payment/check/bmdm', (req, res, next) => {
  const body = req.body;
  restTools.callAPIPut(`${JAVA_URL}/payment/check/bmdm/no_sacrifice_no_victory`, body, res);
});



// 確認使用中的訂單資訊，與預購的訂單
router.get('/basic/payment/paidRecord/using', (req, res, next) => {
  const who = req.user.basicId;
  restTools.callAPIGet(`${JAVA_URL}/basic/payment/paidRecord/using/${who}`, res);
});

// 取得 1.體驗 2.超值 3.無限 三個方案可接的上線中案件數
router.get('/basic/payment/availableOnDemands', (req, res, next) => {
  restTools.callAPIGet(`${JAVA_URL}/payment/availableOnDemands`, res);
});


module.exports = router;
