const Router = require('express').Router;
const router = Router()
const SeniorCoreAxios = require('../../axiosInstance').SeniorCoreAxios;
const AcAuth = require('../../middleware').AcAuth

/**
 * 給瀏覽器端判斷登入使用
 */
router.get('/verify', async (req, res, next) => {
  try {
    const sessionToken = req.cookies.SENIOR_SSO_STORE_ID || '0';

    const { data } = await SeniorCoreAxios.get('/auth/ac', { params: { sessionToken } })
    return res.json(data)
  } catch (error) {
    console.log(error);
    return next(error, req, res)
  }
});

router.get('/test-member', AcAuth(['MEMBER']), (req, res, next) => {
  try {
    console.log(req.LoginInfo);
    return res.json(Object.assign({ hi: 'OK' }, req.LoginInfo))
  } catch (error) {
    console.log(error);
    return next(error, req, res)
  }
});

router.get('/test-register', AcAuth(['REGISTER']), (req, res, next) => {
  try {
    console.log(req.LoginInfo);
    return res.json(Object.assign({ hi: 'OK' }, req.LoginInfo))
  } catch (error) {
    console.log(error);
    return next(error, req, res)
  }
});

module.exports = router
