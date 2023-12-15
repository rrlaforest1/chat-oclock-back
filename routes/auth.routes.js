const router = require("express").Router();
const User = require("./../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 12;

/**
 * ! All routes are prefixed by /auth
 */

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 1- Check if the user exist
    // The email might already be used
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      return res
        .status(400)
        .json({ message: `The email ${email} is already used.` });
    }

    // 2- Is the password safe?
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
    }

    // 3- Hash the password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4- Save the user in the DB

    const createdUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: `User ${createdUser.username} has been created with id ${createdUser._id}`,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/connect", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email }).select("password email");

    if (!foundUser) {
      return res.status(400).json({ message: "Wrong credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Wrong credentials" });
    }

    const payload = { _id: foundUser._id };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
