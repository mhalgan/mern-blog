const express = require("express");
const {
  userRegisterController,
} = require("../../controllers/users/usersController");
const usersRoutes = express.Router();

usersRoutes.post("/register", userRegisterController);
usersRoutes.post("/api/users/login", (req, res) => {
  res.json({ user: "User Login" });
});

module.exports = usersRoutes;
