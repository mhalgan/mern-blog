const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/user/User");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findById(decodedToken?.id).select("-password");
        req.user = user;
        next();
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, login again");
    }
  } else {
    res.status(401);
    throw new Error("There is no token attached to the header");
  }
});

module.exports = authMiddleware;
