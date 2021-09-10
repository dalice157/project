var request = require('request');
const config = require('../config/config');
const logger = require('../config/logger.js');

function status(response) {
  if (response.ok) {
    return response.json();
  } else {
    return response.json().then(function (err) {
      err.status = response.status;
      throw err;
    });
  }
}

function jsonStatus(response) {
  if (response.ok) {
    return response.text();
  } else {
    return response.text().then(function (err) {
      err.status = response.status;
      throw err;
    });
  }
}

function commonRest(promise, res) {
  return promise.then(status)
    .then(json => {
      // logger.debug(`Request REST succeeded ${JSON.stringify(json, null, 2)}`);

      return res ? res.status(200).json(json) : json;
    }) // return to chain
    .catch(error => {
      //  不log 後端的403     
      if(!error.status || error.status != 403)
        logger.error(`Request REST failed ${JSON.stringify(error, null, 2)}`);
      
      if (res) {
        let apiError = error.errors || { message: 'internal error' };
        res.status(error.status || 500).json({ 'error': apiError.message, 'sysMsgKey': error.sysMsgKey })
      } else {
        throw error;
      }
    });
}

function callAPIGet(url, res) {
  logger.debug(`API [GET] : ${url}`);

  const promise = fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });

  return commonRest(promise, res);
}

function callJSGet(url, res) {
  return test = fetch(url, { method: 'GET' })
    .then(jsonStatus)
    .then(text => {
      let cleanArea = text.replace(/^[\s\uFEFF\xa0\u3000]+|[\uFEFF\xa0\u3000\s]+$/g, ""); // 過濾 BOM
      cleanArea = JSON.parse(cleanArea);

      return res ? res.status(200).json(cleanArea) : cleanArea;
    })
    .catch(error => {
      logger.error(`Request REST failed ${JSON.stringify(error, null, 2)}`);

      let apiError = error.errors || { message: 'internal error' };
      res.status(error.status || 500).json({ 'error': apiError.message, 'sysMsgKey': error.sysMsgKey });
    });
}

function callAPIPost(url, body, res) {
  logger.debug(`API [POST] : ${url}`);
  logger.debug(`API [POST] body: ${JSON.stringify(body)}`);

  const promise = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: typeof body === 'object' ? JSON.stringify(body) : body
  });

  return commonRest(promise, res);
}

function callAPIPut(url, body, res) {
  logger.debug(`API [Put] : ${url}`);
  logger.debug(`API [Put] body: ${JSON.stringify(body)}`);

  const promise = fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: typeof body === 'object' ? JSON.stringify(body) : body
  });

  return commonRest(promise, res);
}

function callAPIDelete(url, res) {
  logger.debug(`API [DELETE] : ${url}`);

  const promise = fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    }
  });

  return commonRest(promise, res);
}

module.exports = {
  // restGET: restGETProcess,
  callAPIGet: callAPIGet,
  callJSGet: callJSGet,
  callAPIPost: callAPIPost,
  callAPIPut: callAPIPut,
  callAPIDel: callAPIDelete
};
