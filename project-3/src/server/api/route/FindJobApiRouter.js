const Router = require("express").Router;
const router = Router();
const SeniorCoreAxios = require("../../axiosInstance").SeniorCoreAxios;

router.post("/postJobSearch", async (req, res, next) => {
  try {
    const { data } = await SeniorCoreAxios.post("/50talent/jobs", req.body);
    res.json({ ...data });
  } catch (error) {
    next(error, req, res);
  }
});

module.exports = router;
