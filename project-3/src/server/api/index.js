const nocache = require("nocache");
const AcAuth = require("../middleware").AcAuth;
const LoginApiRouter = require("./route/LoginApiRouter");
const FindJobApiRouter = require("./route/FindJobApiRouter");

exports.app = app => {
  // 原本的api server(由高年級工程持續維護)

  // 檢查referer：如果不是空值，就必須是網域
  app.use("/50talent/_api", (req, res, next) => {
    console.log(req.headers);
    if (
      req.headers.host &&
      [
        "localhost:8080",
        "localhost:8083",
        "127.0.0.1:8080",
        "127.0.0.1:8083"
      ].includes(req.headers.host)
    ) {
      next();
    } else if (
      !req.headers.referer ||
      (req.headers.referer &&
        req.headers.referer === `https://${process.env.SENIOR_DOMAIN}`)
    ) {
      next();
    } else {
      res.status(403);
      return res.json({ error: 403 });
    }
  });

  app.use("/50talent/_api/login", nocache(), LoginApiRouter);
  app.use("/50talent/_api/findJob", nocache(), FindJobApiRouter);
};
