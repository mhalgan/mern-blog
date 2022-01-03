const asyncHandler = require("express-async-handler");
const User = require("../../models/user/User");
const generateToken = require("../../config/token/generateToken");
const validateMongoID = require("../../utils/validateMongoID");

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

module.exports = {
  userRegisterController,
  userLoginController,
  fetchAllUsersController,
  fetchUserDetailsController,
  deleteUserController,
};
