const router = require("express").Router();
const User = require("./../models/User.model");
const { isAuthenticated } = require("./../middlewares/auth");

/**
 * ! All routes are prefixed by /user
 */

router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

router.get("/verify", isAuthenticated, async (req, res, next) => {
  try {
    const connectedUser = await User.findById(req.userId);
    res.json(connectedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
