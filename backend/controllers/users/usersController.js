const asyncHandler = require("express-async-handler");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const generateToken = require("../../config/token/generateToken");
const validateMongoID = require("../../utils/validateMongoID");
const User = require("../../models/user/User");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const userRegisterController = asyncHandler(async (req, res) => {
  const userExists = await User.findOne({ email: req?.body?.email });
  if (userExists) throw new Error("User already exists");

  try {
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

const userLoginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userFound = await User.findOne({ email });

  if (userFound && (await userFound.isPasswordMatched(password))) {
    const { firstName, lastName, email, profilePhoto, isAdmin, id } = userFound;
    const token = generateToken(id);

    res.json({ id, firstName, lastName, email, profilePhoto, isAdmin, token });
  } else {
    res.status(401);
    throw new Error(`Login credentials are not valid`);
  }
});

const fetchAllUsersController = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

const fetchUserDetailsController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);

  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

const userProfileController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);

  try {
    const userProfile = await User.findById(id);
    res.json(userProfile);
  } catch (error) {
    res.json(error);
  }
});

const updateUserController = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoID(id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        bio: req?.body?.bio,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    res.json(error);
  }
});

const updateUserPasswordController = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { password } = req.body;
  validateMongoID(id);

  try {
    const user = await User.findById(id);

    if (password) {
      user.password = password;
      const updatedUser = await user.save();
      res.json(updatedUser);
    }
  } catch (error) {
    res.json(error);
  }
});

const deleteUserController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});

const followUserController = asyncHandler(async (req, res) => {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  const targetUser = await User.findById(followId);
  const alreadyFollowing = targetUser?.followers?.find(
    (followerId) => followerId?.toString() === loginUserId
  );

  if (alreadyFollowing) throw new Error("You already followed this user");
  // Update the Followers field from the user being followed with the login user
  await User.findByIdAndUpdate(
    followId,
    {
      $push: { followers: loginUserId },
      isFollowing: true,
    },
    { new: true }
  );

  // Update the login user Following field with the user being followed
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: { following: followId },
    },
    { new: true }
  );

  res.json({ message: "You have successfully followed this user" });
});

const unfollowUserController = asyncHandler(async (req, res) => {
  const { unfollowId } = req.body;
  const loginUserId = req.user.id;

  // Remove login user from the Followers field on the user being unfollowed
  await User.findByIdAndUpdate(
    unfollowId,
    {
      $pull: { followers: loginUserId },
      isFollowing: false,
    },
    { new: true }
  );

  // Remove user being unfoolowed from the login user Following field
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: { following: unfollowId },
    },
    { new: true }
  );

  res.json({ message: "You have successfully unfollowed this user" });
});

const blockUserController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

const unblockUserController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoID(id);

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

const generateVerificationTokenController = asyncHandler(async (req, res) => {
  const loginUserId = req.user?.id;
  const user = await User.findById(loginUserId);

  const verificationToken = await user.createAccountVerificationToken();
  await user.save();

  const resetUrl = `http://localhost:3000/verify-account/${verificationToken}`;

  try {
    const msg = {
      to: "glbrcmrg@gmail.com",
      from: "gccr92@gmail.com",
      subject: "Account verification",
      html: `The following link will expire within 30 minutes: <a href="${resetUrl}">Click here to verify your account</a>`,
    };

    await sgMail.send(msg);
    res.json({ message: "Email sent" });
  } catch (error) {
    res.json(error);
  }
});

const accountVerificationController = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const foundUser = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: Date.now() },
  });

  if (!foundUser) throw new Error("Token expired, try again later");

  foundUser.isAccountVerified = true;
  foundUser.accountVerificationToken = undefined;
  foundUser.accountVerificationTokenExpires = undefined;

  await foundUser.save();
  res.json({ message: "User successfully verified" });
});

module.exports = {
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
};
