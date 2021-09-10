const logger = require('../config/logger.js');
const config = require('../config/config');
const http = require('request');
const jwt = require('jsonwebtoken');
// const restTools = require('../helper/restTool.js');

const JAVA_URL = config.backend.domain;
const COOKIE_SECURE = config.app.env !== 'local'

function handleLogout(pid, sessionStore, res) {
  sessionStore.get(pid, function (noUse, sessionKey) {
    if (sessionKey && sessionKey.sessionID) {
      let session = sessionStore.get(sessionKey.sessionID, function (noUse, session) {
        const access_token = session.passport.user.access_token;
        sessionStore.destroy(sessionKey.sessionID);

        let headers = {};
        const b64Auth = Buffer.from(config.oidc.client_id + ':' + config.oidc.clientSecret).toString('base64');
        headers.Authorization = 'Basic ' + b64Auth;
        const body = {
          'client_id': config.oidc.client_id,
          'client_secret': config.oidc.clientSecret,
          'token': access_token,
          'token_type_hint': 'access_token'
        };

        fetch(`${config.oidc.url}/oauth2/revoke`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body)
        }).then(function (response) {
          console.log('Token Revoked by 104Top');
          res.end('done');
        });
      });
    } else {
      res.end('Not found login meta');
    }
  });
}

module.exports = function (router, passport, sessionStore) {

  router.get('/api/login', (req, res, next) => {
    req.session.returnTo = req.query.pageRef || req.headers.referer || '/';
    passport.authenticate('oidc', { successReturnToOrRedirect: "/" })(req, res, next);
  });

  router.get('/api/CRM-initiating-login', (req, res, next) => {
    res.cookie('_topAdminCS', req.query.plus ? 'ALL' : 'TOP_ONLY', { signed: true, httpOnly: true, secure: COOKIE_SECURE });
    const impersonation_token = req.query.impersonation_token;
    passport.authenticate('initiated_oidc', { successReturnToOrRedirect: "/", redirect_uri: config.oidc.initiated_redirect_url, prompt: 'login', impersonation_token: impersonation_token })(req, res, next);
  });


  router.get('/api/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.clearCookie('_top', { path: '/' });
    res.clearCookie('_topAdminCS', { path: '/' });
    res.redirect('/');
  });

  // SLO callback (backchannel_logout_uri)
  router.post('/api/oidcLogout', (req, res, next) => {
    // logger.debug(`body: ${JSON.stringify(req.body, null, 2)}`);
    const logout_token = req.body.logout_token;
    const logoutObj = jwt.decode(logout_token);

    // logger.debug(`logoutObj: ${JSON.stringify(logoutObj, null, 2)}`);
    const { aud, events, iat, sid, sub } = logoutObj;
    const validAud = aud.length > 0 && aud[0] === config.oidc.client_id;
    const validEvents = typeof events === 'object' && events.hasOwnProperty('http://schemas.openid.net/event/backchannel-logout');
    // logger.debug(`typeof events: ${typeof events}`);
    // logger.debug(`events.hasOwnProperty: ${events.hasOwnProperty('http://schemas.openid.net/event/backchannel-logout')}`);
    const nowTime = new Date().getTime() / 1000;
    const validIat = (nowTime - iat) < 10;
    const validKey = typeof sub !== 'undefined' || typeof sid !== 'undefined';
    // logger.debug(`validAud: ${validAud}, validEvents: ${validEvents}, validIat: ${validIat}, validKey: ${validKey}`);
    if (!validAud || !validEvents || !validIat || !validKey) {
      res.end('Invalid Logout Token.');
    }

    handleLogout(sub, sessionStore, res);

    sessionStore.destroy(sub);
  });

  // BS call manual logout
  router.get('/api/manualLogout/:pid', (req, res, next) => {
    handleLogout(req.params.pid, sessionStore, res);
    sessionStore.destroy(req.params.pid);
  });

  router.get('/api/samlLogout', (req, res, next) => {
    const state = Math.random().toString(36).substr(2);
    const id_token = req.session.passport.user.id_token;
    res.redirect(`${config.oidc.url}/oauth2/sessions/logout?id_token_hint=${id_token}&post_logout_redirect_uri=${config.oidc.post_logout_redirect_uri}&state=${state}`);
  });

  // OIDC Consumer 內建驗證處理
  router.get('/api/oidc/callback', passport.authenticate('oidc', {
    callback: true,
    successRedirect: config.oidc.login_relay,
    failureRedirect: '/?msg=ac-token-faile'
  }));

  // OIDC Consumer 代登的流程
  router.get('/api/oidc/initiating-callback', function (req, res, next) {
    // 在 routes 的 handler 中使用 passport.authenticate
    passport.authenticate('initiated_oidc', {
      callback: true,
      redirect_uri: config.oidc.initiated_redirect_url
    }, function (err, user, info) {
      if (err) {
        console.log('login faile', err);
        return next(err);
      }
      // console.log('login info',info);
      // console.log('login user',user);

      // 如果找不到使用者
      if (!user) { return res.redirect('/?msg=ac-token-faile'); }

      // 否則登入
      req.logIn(user, function (err) {
        if (err) { return next(err); }

        const topEmp = req.cookies.top_emp;
        const isTopAdminCS = req.signedCookies._topAdminCS;
        if (isTopAdminCS && isTopAdminCS == 'ALL' && topEmp) { // 全登入
          console
          const promise = fetch(`${JAVA_URL}/bs/member/initiatingToken/${user.pid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'cookie': 'top_emp=' + topEmp
            },
            body: {}
          });

          promise.then(response => response.json()).then(json => {
            if (json.error) {
              console.log('json', json);
              return res.redirect('/?msg=ac-token-faile');
            } else {
              return res.redirect(config.oidc.plus_url + "/auth/initiatingLoginCallback?impersonation_token=" + json.data.acToken + '&sid=' + user.sid);
            }
          });
        } else { // 只登plus
          return res.redirect('/');
        }
      });
    })(req, res, next);
  });

  router.get('/api/dispatch', (req, res, next) => {
    const returnTo = req.session.returnTo || '/';
    req.session.returnTo = null;

    res.redirect(returnTo);
  });

  router.get('/api/saveOriginPage', (req, res, next) => {
    req.session.returnTo = req.query.pageRef || req.headers.referer || '/';
    // logger.debug(`\x1b[36m saveOriginPage pageRef= ${req.query.pageRef}\x1b[0m`);
    // logger.debug(`\x1b[36m saveOriginPage req.query.redirectTo= ${req.query.redirectTo}\x1b[0m`);
    let redirectUrl = req.query.redirectTo;

    if (redirectUrl.indexOf('nextStep') > -1) {
      // logger.debug(`\x1b[36m saveOriginPage nextStep= ${redirectUrl.indexOf('nextStep')}\x1b[0m`);
      const indexOfNextStep = redirectUrl.indexOf('nextStep');

      const path = redirectUrl.substring(0, indexOfNextStep);
      const parameters = redirectUrl.substring(indexOfNextStep, redirectUrl.length);
      // 將nextStep=後面帶的parameter全部encode
      const encodeParameters = parameters
        .substring(0, parameters.indexOf('=') + 1)
        .concat(encodeURIComponent(parameters.substring(parameters.indexOf('=') + 1, parameters.length)));

      redirectUrl = path.concat(encodeParameters);
    }
    // logger.debug(`\x1b[36m saveOriginPage redirectUrl= ${redirectUrl}\x1b[0m`);
    res.redirect(redirectUrl);
  });


  return router;
}