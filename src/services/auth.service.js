const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const {Token,ResetPassword }= require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const [user] = await Promise.all([
    userService.getUserByEmail(email),
  ]);

  let foundUser = null;
  for (const u of [user]) {
    if (u && (await u.isPasswordMatch(password))) {
      foundUser = u;
      break;
    }
  }

  if (!foundUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  return foundUser;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);

    let foundUser = null;
    let typeOfUser = null;

    const user = await userService.getUserById(refreshTokenDoc.user);
    if (user) {
      foundUser = user;
      typeOfUser = 'User';
    }

    // const teacher = await teacherService.getTeacherById(refreshTokenDoc.user);
    // if (teacher) {
    //   foundUser = teacher;
    //   typeOfUser = 'Teacher';
    // }

    // const parent = await parentService.getParentById(refreshTokenDoc.user);
    // if (parent) {
    //   foundUser = parent;
    //   typeOfUser = 'Parent';
    // }

    // const student = await studentService.getStudentById(refreshTokenDoc.user);
    // if (student) {
    //   foundUser = student;
    //   typeOfUser = 'Student';
    // }

    if (!foundUser) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(foundUser, typeOfUser);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyResetPasswordToken(resetPasswordToken);

    let foundUser;

    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (user) {
      await userService.updateUserById(user.id, { password: newPassword });
      await ResetPassword.deleteMany({ user: user.id });
      foundUser = user;
    }

    if (!foundUser) {
      throw new Error();
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    await tokenService.verifyResetPasswordToken(verifyEmailToken);

  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
