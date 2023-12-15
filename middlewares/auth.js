const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "No token found in the headers" });
    }
    token = token.replace("Bearer ", "");

    const payload = jwt.verify(token, process.env.TOKEN_SECRET, {
      algorithms: ["HS256"],
    });

    //! This line make everything works!
    req.userId = payload._id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isAuthenticated };
