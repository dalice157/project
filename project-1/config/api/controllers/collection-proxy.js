const express = require('express')
const config = require('../config/config');
const logger = require('../config/logger.js');
const restTools = require('../helper/restTool.js');

const router = express.Router();
const JAVA_URL = config.backend.domain;

// 新增收藏 PUT
router.put('/favorite/add/:gigId', (req, res, next) => {
    const who = req.user.basicId;
    const gigId = req.params.gigId;
    const body = req.body;
    restTools.callAPIPut(`${JAVA_URL}/favorite/add?gigId=${gigId}&who=${who}`, body, res);
});

// 刪除收藏 DELETE
router.delete('/favorite/delete/:favoriteId', (req, res) => {
    const who = req.user.basicId;
    const favoriteId = req.params.favoriteId;
    restTools.callAPIDel(`${JAVA_URL}/favorite/delete?favoriteId=${encodeURIComponent(favoriteId)}&who=${who}`, res);
});

// 使用者收藏的服務資料 GET
router.get('/favorite/show/:pageNumber', (req, res) => {
    const who = req.user.basicId;
    const pageNumber = req.params.pageNumber;
    let queryString = who.concat( ( 1 <= pageNumber && pageNumber<=12 ) ? '?page='.concat(pageNumber) : '');
    restTools.callAPIGet(`${JAVA_URL}/favorite/mine/${queryString}`, res);
});


module.exports = router;