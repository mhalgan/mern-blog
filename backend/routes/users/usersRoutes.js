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
  blockUserController,
  unblockUserController,
  generateVerificationTokenController,
  accountVerificationController,
} = require("../../controllers/users/usersController");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const usersRoutes = express.Router();

usersRoutes.post("/register", userRegisterController);
usersRoutes.post("/login", userLoginController);
usersRoutes.post(
  "/generate-verification-token",
  authMiddleware,
  generateVerificationTokenController
);
usersRoutes.post(
  "/verify-account",
  authMiddleware,
  accountVerificationController
);
usersRoutes.get("/", authMiddleware, fetchAllUsersController);
usersRoutes.get("/profile/:id", authMiddleware, userProfileController);
usersRoutes.get("/:id", fetchUserDetailsController);
usersRoutes.put("/follow", authMiddleware, followUserController);
usersRoutes.put("/unfollow", authMiddleware, unfollowUserController);
usersRoutes.put("/block/:id", authMiddleware, blockUserController);
usersRoutes.put("/unblock/:id", authMiddleware, unblockUserController);
usersRoutes.put("/:id", authMiddleware, updateUserController);
usersRoutes.put("/password/:id", authMiddleware, updateUserPasswordController);
usersRoutes.delete("/:id", deleteUserController);

module.exports = usersRoutes;
