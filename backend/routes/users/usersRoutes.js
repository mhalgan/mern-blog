const express = require("express");
const {
  userRegisterController,
  userLoginController,
} = require("../../controllers/users/usersController");
const usersRoutes = express.Router();

usersRoutes.post("/register", userRegisterController);
usersRoutes.post("/login", userLoginController);

module.exports = usersRoutes;
