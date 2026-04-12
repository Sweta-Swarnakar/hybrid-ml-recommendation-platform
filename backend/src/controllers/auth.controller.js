const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/user.service");

const signup = asyncHandler(async (req, res) => {
  const data = await userService.signup(req.body);
  res.status(201).json(data);
});

const loginUser = asyncHandler(async (req, res) => {
  const data = await userService.login(req.body);
  res.json(data);
});

module.exports = {
  signup,
  loginUser,
};