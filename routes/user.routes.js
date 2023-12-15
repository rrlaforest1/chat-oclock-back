const router = require("express").Router();
const User = require("./../models/User.model");
const { isAuthenticated } = require("./../middlewares/auth");

/**
 * ! All routes are prefixed by /user
 */

router.get("/verify", isAuthenticated, async (req, res, next) => {
  try {
    const connectedUser = await User.findById(req.userId);
    console.log("connectedUser", connectedUser);
    res.json(connectedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
