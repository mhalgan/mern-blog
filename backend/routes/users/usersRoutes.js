const express = require("express");
const {
  userRegisterController,
  userLoginController,
  fetchAllUsersController,
  deleteUserController,
  fetchUserDetailsController,
} = require("../../controllers/users/usersController");
const usersRoutes = express.Router();

usersRoutes.post("/register", userRegisterController);
usersRoutes.post("/login", userLoginController);
usersRoutes.get("/", fetchAllUsersController);
usersRoutes.get("/:id", fetchUserDetailsController);
usersRoutes.delete("/:id", deleteUserController);

module.exports = usersRoutes;
