const SeniorCoreAxios = require('../axiosInstance').SeniorCoreAxios;

/**
 *
 * @param {*} role 陣列
 * REGISTER 註冊使用
 * MEMBER 會員權限
 *
 *
 */
module.exports = function (role) {
  return async function (req, res, next) {
    if (!Array.isArray(role) || role.length === 0) {
      res.status(403)
      return res.json({ error: 403, message: '沒有指定權限' })
    }

    const SENIOR_SSO_STORE_ID = req.cookies.SENIOR_SSO_STORE_ID || '0';

    const { data } = await SeniorCoreAxios.get('/auth/ac', { params: { sessionToken: SENIOR_SSO_STORE_ID } });

    if (role.includes('REGISTER') && data.data && data.data.isLogin === false && data.data.isMember === false && !!data.data.ac) {
      req.LoginInfo = Object.assign(data.data, { SENIOR_SSO_STORE_ID });
      next();
    } else if (role.includes('MEMBER') && data.data && data.data.isLogin === true) {
      req.LoginInfo = Object.assign(data.data, { SENIOR_SSO_STORE_ID })
      next();
    } else if (role.includes('MEMBER') && data.data && data.data.isLogin === false) { // 增加AcAuth(['MEMBER']for漢堡選單判斷
      req.LoginInfo = Object.assign(data.data)
      next();
    } else {
      res.status(403)
      return res.json({ error: 403 })
    }
  }
}
