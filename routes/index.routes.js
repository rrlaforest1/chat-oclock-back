const router = require("express").Router();
const { isAuthenticated } = require("./../middlewares/auth");

router.use("/auth", require("./auth.routes"));
router.use("/user", require("./user.routes"));

// router.use(isAuthenticated);

router.use("/message", require("./message.routes"));

module.exports = router;
