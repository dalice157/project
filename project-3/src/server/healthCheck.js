module.exports = function (app) {
  app.get('/50talent/health', (req, res) => res.status(200).send('OK'))
}
