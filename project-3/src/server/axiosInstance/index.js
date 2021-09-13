// const https = require('https')
const axios = require('axios')
const config = require('config')


module.exports.SeniorCoreAxios = axios.create({
  baseURL: `https://${config.seniorCoreDcAPI.domain}`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  proxy: false,
  // httpsAgent: agent
});

