const express = require('express')
const router = express.Router();
const config = require('../config/config');
const logger = require('../config/logger.js');
// const restTools = require('../helper/restTool.js');
const Twilio = require('twilio')
const MyRequestClient = require('../helper/RequestClient.js');
const AccessToken = Twilio.jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant
const FCM_Credential_Sid = config.twilio.fcm;
let twilioClient;

if (config.app.env === 'local') {
  // require('dotenv').config({ path: 'api/.env.local' }); move to config
  twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
} else {
  twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {
    httpClient: new MyRequestClient(process.env.HTTP_PROXY)
  });
}

router.get('/token', function (req, res) {
  const renew = req.query.renew;
  let cacheToken = req.user.twilioToken;
  if(renew || !cacheToken) {    
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      {
        'ttl': config.twilio.ttl
      },
    )
    
    twilioClient.chat.services(process.env.TWILIO_CHAT_SERVICE_SID)
      .update({
        'notifications.newMessage.enabled': true,
        'notifications.newMessage.sound': 'default',
        'notifications.newMessage.template': '${MESSAGE}'
      });
      // .then(service => console.log(service));
  
    const chatGrant = new ChatGrant({
      serviceSid: process.env.TWILIO_CHAT_SERVICE_SID,
      pushCredentialSid: FCM_Credential_Sid,
    });
  
    // console.log(`FCM_Credential_Sid: ${FCM_Credential_Sid}`);
    // console.log(chatGrant);
  
    token.addGrant(chatGrant);
    const identity = String(req.user.basicId); // req.user.pid, req.user.basicId
    token.identity = identity;
  
    cacheToken = {
      identity: identity,
      jwt: token.toJwt()
    };
    req.session.passport.user.twilioToken = cacheToken;
    // res.send(cacheToken);
  } 
  res.send(cacheToken);
});

router.post('/channel/create', async function (req, res) {
  try {
    let channel = await twilioClient.chat.services(process.env.TWILIO_CHAT_SERVICE_SID)
      .channels
      .create({
        uniqueName: req.body.channelName,
        type: 'private',
        createdBy: req.body.user,
      });

    let member = await twilioClient.chat.services(process.env.TWILIO_CHAT_SERVICE_SID)
      .channels(channel.sid)
      .members
      .create({ identity: req.body.user });

    let member2 = await twilioClient.chat.services(process.env.TWILIO_CHAT_SERVICE_SID)
      .channels(channel.sid)
      .members
      .create({ identity: req.body.other });

    res.send({
      success: true,
      channel: channel,
      member: member,
      member2: member2,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error,
    });
  }
});

/**
 * 加入聊天室
 */
router.post('/channel/join', async function (req, res) {
  const who = req.user.basicId;
  try {
    let channel = await twilioClient.chat.services(process.env.TWILIO_CHAT_SERVICE_SID)
      .channels(req.body.imPk)
      .fetch()
      .then(channel => {
        return channel;
      })

    let addMember = await twilioClient.chat.services(process.env.TWILIO_CHAT_SERVICE_SID)
      .channels(channel.sid)
      .members.create({ identity: who })
      .then(member => {
        return member;
      })

    res.send({
      success: true,
      channel: channel,
      addMember: addMember,
    });

  } catch (error) {
    logger.debug(JSON.stringify(error));
    res.send({
      success: false,
      error: error,
    });
  }
});

module.exports = router;