const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

/**
 * SIGNUP
 */
exports.signup = async (body) => {
  const { firstName, lastName, email, password } = body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const err = new Error("User already exists");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  return {
    success: true,
    token: generateToken(user._id),
    data: user,
  };
};

/**
 * LOGIN
 */
exports.login = async (body) => {
  const { email, password } = body;

  const user = await User.findOne({ email });

  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  return {
    success: true,
    token: generateToken(user._id),
    data: user,
  };
};