const router = require("express").Router();
const Message = require("./../models/Message.model");
const { isAuthenticated } = require("./../middlewares/auth");

/**
 * ! All routes are prefixed by /message
 */

router.get("/", async (req, res, next) => {
  try {
    const allMessages = await Message.find().populate("user");
    res.json(allMessages);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  console.log("message post");
  try {
    const userId = req.userId;
    console.log("userId", userId);

    const message = req.body.message;

    console.log("message", message);
    const newMessage = await Message.create({
      user: userId,
      message: message,
    });
    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
