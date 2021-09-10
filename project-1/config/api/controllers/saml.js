const logger = require('../config/logger.js');
const config = require('../config/config');
const restTools = require('../helper/restTool.js');

const SMAL_FORMAT = 'urn:oasis:names:tc:SAML:2.0:nameid-format:entity';
const JAVA_URL = config.backend.domain;
const COOKIE_SECURE = config.app.env !== 'local'

module.exports = function (router, passport) {

  router.get('/api/login', (req, res, next) => {
    req.query.RelayState = req.query.pageRef || req.headers.referer || '/';
    passport.authenticate('saml', {})(req, res, next);
  });

  // SLO callback
  router.post('/api/logout', (req, res, next) => {
    req.logout();
    res.clearCookie('_topCS');    
    res.redirect('/');
  });

  router.get('/api/samlLogout', (req, res, next) => {        
      const cs = req.signedCookies._topCS;
      if(cs){
        const user = JSON.parse(cs);
        const samlStrategy = passport._strategy('saml');

        //Here add the nameID and nameIDFormat to the user if you stored it someplace.
        req.user = {};
        req.user.nameID = user.pid;
        req.user.nameIDFormat = SMAL_FORMAT;
        req.user.sessionIndex = user.ssoTokenId;


        samlStrategy.logout(req, function(err, request){
            if(!err){
                //redirect to the IdP Logout URL
                res.redirect(request);
            }
        });        
      }     
  });  

  // SAML Consumer
  router.post('/api/saml/callback',
    passport.authenticate('saml', {
      session: false,
      // successFlash: 'Welcome!',
      // failureFlash: 'err_msg_g: something went wrong',
      // failureFlash: true,
      failureRedirect: '/',
    }),
    function (req, res) {
      if(req.isAuthenticated()) {        
        const user = req.user;
        let pageRef = req.body.RelayState || '/';
        // Save to cookie
        //TODO 要另外處理,啟用服務
        restTools.callAPIGet(`${JAVA_URL}/profile/pid2basicId/${user.pid}`,null)
          .then(json => {
            user.basicId = json.id
            res.cookie('_topCS', JSON.stringify(user), { signed: true, httpOnly: true, secure:COOKIE_SECURE});
            //res.cookie('PI', user.pid, {httpOnly: true});
    
            logger.info(`使用者 ${user.pid} 成功登入`);
            // const msg = encodeURIComponent(`使用者 ${user.pid} 成功登入`);
            

            if (pageRef.indexOf('%') > -1) {
              pageRef = decodeURIComponent(pageRef);
            }
            res.redirect(pageRef);  
          });
      }else{
        res.redirect('/');
      }      
    }
  ); 

  

  return router;
}