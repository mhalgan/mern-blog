const express = require("express");
const {
  userRegisterController,
  userLoginController,
  fetchAllUsersController,
  fetchUserDetailsController,
  userProfileController,
  updateUserController,
  updateUserPasswordController,
  deleteUserController,
  followUserController,
  unfollowUserController,
} = require("../../controllers/users/usersController");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const usersRoutes = express.Router();

usersRoutes.post("/register", userRegisterController);
usersRoutes.post("/login", userLoginController);
usersRoutes.get("/", authMiddleware, fetchAllUsersController);
usersRoutes.get("/profile/:id", authMiddleware, userProfileController);
usersRoutes.get("/:id", fetchUserDetailsController);
usersRoutes.put("/follow", authMiddleware, followUserController);
usersRoutes.put("/unfollow", authMiddleware, unfollowUserController);
usersRoutes.put("/:id", authMiddleware, updateUserController);
usersRoutes.put("/password/:id", authMiddleware, updateUserPasswordController);
usersRoutes.delete("/:id", deleteUserController);

module.exports = usersRoutes;
