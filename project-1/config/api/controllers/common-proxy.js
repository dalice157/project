const express = require('express')
const config = require('../config/config');
const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');

const router = express.Router();
const JAVA_URL = config.backend.domain;

const validateBasicId = (req, res, next) => {
  const basicId = req.params.basicId;
  if(basicId) {
    next();
  } else {
    res.status(400).json({});
  }
}

router.post('/errorLogging', (req, res, next) => {
  const loginUser = req.session && req.session.passport && req.session.passport.user;
  const who = loginUser && loginUser.basicId ? loginUser.basicId : '';
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  logger.error(`[${req.body.message}] 
    [URL:${req.body.url}]
    [ip:${ip}] 
    [who:${who}]
    [user-agent:${userAgent}] - 
    ${req.body.stackMsg}`);
  res.status(200).json({ status: 200 });
});

router.get('/redirect/chkActiveProcess', (req, res, next) => {
  const loginUser = req.session && req.session.passport && req.session.passport.user;
  const basicId = loginUser && loginUser.basicId ? loginUser.basicId : '';
  // 未登入
  if (!loginUser) {
    res.status(311).json({ 'location': '/api/login' });
    return;
  }
  
  // 若為全新會員，直接導入啟用頁
  const pageRef = encodeURIComponent(req.headers.referer); // 來源頁
  const nextStep = req.query.redirectTo; // 目標頁
  const redirectToUri = encodeURIComponent(`/enableCaseUser` + (nextStep ? '?nextStep=' + nextStep : ''));

  if (!basicId) {
  // logger.debug(`\x1b[36m pageRef= ${pageRef}\x1b[0m`);
    
    let queryUri = `?pageRef=${pageRef}&redirectTo=${redirectToUri}`;
    const url = `/api/saveOriginPage${queryUri}`
    // logger.debug(`url = ${url}`);

    res.status(311).json({ 'location': url });
    return;
  } else if (loginUser.shouldCompleteInfo) {
    res.status(428).json({ 'error': 'should-complete-info', 'nextStep': nextStep });
    return;
  }

  if (!req.query.redirectTo) {
    res.status(200).json({ 'success': true });
  } else {
    res.status(311).json({ 'location': `${req.query.redirectTo || '/'}` });
  }
});

router.get('/redirect/checkPublishDemand', (req, res, next) => {
  const loginUser = req.session && req.session.passport && req.session.passport.user;
  const basicId = loginUser && loginUser.basicId ? loginUser.basicId : '';
  // 未登入
  if (!loginUser) {
    res.status(311).json({ 'location': '/api/login' });
    return;
  }
    
  // 若為全新會員，進入啟動會員與發布案件
  const pageRef = encodeURIComponent(req.headers.referer);
  const nextStep = req.query.redirectTo;
  const demandType = req.query.demandType;
  const redirectToUri = encodeURIComponent(`/joincaseForm?demandType=${demandType}`);

  if (!basicId) {
    let queryUri = `?pageRef=${pageRef}&redirectTo=${redirectToUri}`;
    const url = `/api/saveOriginPage${queryUri}`;
    res.status(311).json({ 'location': url });
    return;
  } else if (loginUser.shouldCompleteInfo) {
    res.status(428).json({ 'error': 'should-complete-info', 'nextStep': nextStep || '/' });
  } else if (!nextStep) {
    res.status(200).json({ 'success': true });
  } else {
    res.status(311).json({ 'location': '/' });
  }
});

//個人服務介紹頁 - C profile 自我介紹
router.get('/common/shareProfile/:topperId', (req, res, next) => {
  restTools.callAPIGet(`${JAVA_URL}/common/shareProfile/${req.params.topperId}`, res);
});

//個人服務介紹頁 - 右側個人成就資訊
router.get('/gig-detail/:topperId/:gigId?', (req, res, next) => {
  const loginUser = req.session && req.session.passport && req.session.passport.user;
  const who = loginUser && loginUser.basicId ? loginUser.basicId : '';
  const gigId = req.params.gigId;
  const queryString = `${gigId ? '&gigId=' + gigId : ''}${who ? '&who=' + who : ''}`;
  restTools.callAPIGet(`${JAVA_URL}/gig-detail/${req.params.topperId}?1=1${queryString}`, res);
});


//個人服務介紹頁 - 左側個人成就資訊
router.get('/gig-self-achievement/:topperId', (req, res, next) => {
  restTools.callAPIGet(`${JAVA_URL}/gig-self-achievement/${req.params.topperId}`, res);
});

// Gig Search
router.get('/search', (req, res, next) => {
  const loginUser = req.session && req.session.passport && req.session.passport.user;
  const who = loginUser && loginUser.basicId ? loginUser.basicId : '';
  const requestKeys = Object.keys(req.query);
  const queryString = requestKeys.length > 0 ? `${requestKeys.map(key => key + '=' + req.query[key]).join('&')}${who ? `&who=${who}` : ''}` : `${who ? `who=${who}` : ''}`;
  restTools.callAPIGet(`${JAVA_URL}/gig/search?${encodeURI(queryString)}`, res);
});

router.get('/staticArea', (req, res, next) => {
  restTools.callJSGet(`${config.static.area_url}`, null).then(json => {
    res.setHeader('Cache-Control', 'max-age=640800, public');
    res.status(200).json(json);
  });
});
router.get('/staticIndust', (req, res, next) => {
  restTools.callJSGet(`${config.static.indust_url}`, null).then(json => {
    res.setHeader('Cache-Control', 'max-age=640800, public');
    res.status(200).json(json);
  });
});

router.get('/profile/:basicId', validateBasicId, (req, res, next) => {
  restTools.callAPIGet(`${JAVA_URL}/profile/${req.params.basicId}`, res);
});

router.get('/profile/gigs/:basicId', validateBasicId, (req, res, next) => {
  restTools.callAPIGet(`${JAVA_URL}/profile/gigs/${req.params.basicId}`, res);
});

router.get('/profile/blockInfo/:basicId', validateBasicId, (req, res, next) => {
  const basicId = req.params.basicId;
  restTools.callAPIGet(`${JAVA_URL}/profile/blockInfo/${basicId}`, res);
});

//服務評價 - 確認高手的發布狀態
router.get('/review/check/:basicId', validateBasicId, (req, res, next) => {
  restTools.callAPIGet(`${JAVA_URL}/review/check/${req.params.basicId}`, res);
});

//服務評價 - 取得side bar 的GigList
router.get('/review/gigList/:basicId', validateBasicId, (req, res, next) => {
  restTools.callAPIGet(`${JAVA_URL}/review/gigList/${req.params.basicId}`, res);
});

//服務評價 - 高手的個人總體平均
router.get('/reviewAvg/:basicId', validateBasicId, (req, res, next) => {
  restTools.callAPIGet(`${JAVA_URL}/reviewAvg/${req.params.basicId}`, res);
});

//服務評價 - 高手的單一Gig總評
router.get('/reviewGig/:basicId/:gigId', validateBasicId, (req, res, next) => {
  restTools.callAPIGet(`${JAVA_URL}/reviewGig/${req.params.basicId}?gigId=${req.params.gigId}`, res);
});

//服務評價 - 高手的服務評價
router.get('/reviewItemList/:basicId/:gigId/:page/:filterBy', validateBasicId, (req, res, next) => {
  const basicId = req.params.basicId;
  restTools.callAPIGet(`${JAVA_URL}/reviewItemList/${basicId}?gigId=${req.params.gigId}&page=${req.params.page}&filterBy=${req.params.filterBy}`, res);
});

// demandList/search(no login)
router.get('/caseList/search', (req, res, next) => {
  const queryString = Object.keys(req.query).map(key => key + '=' + req.query[key]).join('&');
  restTools.callAPIGet(`${JAVA_URL}/demandList/search?${encodeURI(queryString)}`, res);
});

// 案件內容頁
router.get('/common/demand/caseInfo', (req, res, next) => {
  const loginUser = req.session && req.session.passport && req.session.passport.user;
  const who = loginUser && loginUser.basicId ? `/${loginUser.basicId}` : '';
  const demanderBasicId = req.query.basicId;
  restTools.callAPIGet(`${JAVA_URL}/case/content/${demanderBasicId}${who}?demandId=${req.query.demandId}&updateViewCount=${req.updateViewCount}`, res);
});

// 案主從主動應徵信聯絡高手，會新建/更新im，然後重導向到im頁面
router.get('/common/demand/apply', (req, res, next) => {
  if (req.query.payload) {
    restTools.callAPIGet(`${JAVA_URL}/im/receiveApply/v2?payload=${req.query.payload}`, null)
      .then(
        json => {
          const refUrl = encodeURIComponent(`/chat?topperId=${json.data.topperId}&demandId=${json.data.demandId}`);
          res.redirect(`/api/login?pageRef=${refUrl}`);
        },
        json => {
          const refUrl = encodeURIComponent(`/chat?topperId=${json.data.topperId}&demandId=${json.data.demandId}`);
          res.redirect(`/api/login?pageRef=${refUrl}`);
        }
      )
      .catch((error) => {
        let apiError = error.errors || { message: 'internal error' };
        res.status(error.status || 500).json({ 'error': apiError.message, 'sysMsgKey': error.sysMsgKey })
      });
  } else {
    res.redirect('/');
  }
});

// 取消訂閱 DEL
router.delete('/subscribe/cancel', (req, res, next) => {
  const payload = req.query.payload;
  restTools.callAPIDel(`${JAVA_URL}/subscribe/cancel?payload=${payload}`, res);
});

// 取得最新案件電子報的訂閱狀況
router.get('/subscribe/check', (req, res, next) => {
  const payload = req.query.payload;
  restTools.callAPIGet(`${JAVA_URL}/subscribe/check?payload=${payload}`, res);
})

// 主應讀取追踨
router.get('/view/quotation', (req, res, next) => {
  const basicId = req.query.basicId;
  const quotationId = req.query.quotationId;
  restTools.callAPIPut(`${JAVA_URL}/view/quotation?basicId=${basicId}&quotationId=${quotationId}`, null)
    .then(json => {
      let buffer = Buffer.alloc(35);
      buffer.write('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64');
      res.writeHead(200, { 'Content-Type': 'image/gif' });
      res.end(buffer, 'binary');
    })
    .catch((error) => {
      let apiError = error.errors || { message: 'internal error' };
      res.status(error.status || 500).json({ 'error': apiError.message, 'sysMsgKey': error.sysMsgKey })
    });;
});

// 案主經「高手邀請確認合作信」確認合作前，回傳高手名稱
router.get('/common/demanderConfirmCooperate', (req, res, next) => {
  const payload = req.query.payload;
  restTools.callAPIGet(`${JAVA_URL}/common/demanderConfirmCooperate?payload=${payload}`, res);
})

// 案主經「高手邀請確認合作信」確認合作
router.put('/common/demanderConfirmCooperate', (req, res, next) => {
  const payload = req.query.payload;
  restTools.callAPIPut(`${JAVA_URL}/common/demanderConfirmCooperate?payload=${payload}`, null, res);
})

router.get('/common/askReviewInfo', (req, res, next) => {
  const payload = req.query.payload;
  restTools.callAPIGet(`${JAVA_URL}/common/askReviewInfo?payload=${payload}`, res);
});

router.post('/common/review', (req, res, next) => {
  const payload = req.query.payload;
  const body = req.body;
  restTools.callAPIPost(`${JAVA_URL}/common/review?payload=${payload}`, body, res);
});


// 手機版首頁使用
router.get('/common/gigDemandCount', (req, res, next) => {
  const payload = req.query.payload;
  restTools.callAPIGet(`${JAVA_URL}/common/gigDemandCount`, res);
});

// 首頁-精選師資
router.get('/common/pickupTutor', (req, res, next) => {
  const payload = req.query.payload;
  restTools.callAPIGet(`${JAVA_URL}/common/pickupTutor`, res);
});

// 首頁-精選接案高手
router.get('/common/pickupOutsource', (req, res, next) => {
  const payload = req.query.payload;
  restTools.callAPIGet(`${JAVA_URL}/common/pickupOutsource`, res);
});

// 首頁-外包成功案例
router.get('/common/successOutsourceDemand', (req, res, next) => {
  const payload = req.query.payload;
  restTools.callAPIGet(`${JAVA_URL}/common/successOutsourceDemand`, res);
});

// 首頁-家教成功案例
router.get('/common/successTutorDemand', (req, res, next) => {
  const payload = req.query.payload;
  restTools.callAPIGet(`${JAVA_URL}/common/successTutorDemand`, res);
});

// 首頁-熱門分類
router.get('/common/gigDemandPopularCats', (req, res, next) => {
  const payload = req.query.payload;
  restTools.callAPIGet(`${JAVA_URL}/common/gigDemandPopularCats`, res);
});

module.exports = router;