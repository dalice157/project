// const config = require('config')

// const { logger } = require('../logger');

module.exports = function (err, req, res, next) {
  if (err) {
    // logger.error('api:', err)
    return res.status(err.status || 500).send();
  }
  next()
}
