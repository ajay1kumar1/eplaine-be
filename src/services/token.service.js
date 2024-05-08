const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token,ResetPassword } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, typeOfUser, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    typeOfUser,
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, typeOfUser, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    typeOfUser,
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user, typeOfUser) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS, typeOfUser);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH, typeOfUser);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH, typeOfUser);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @param {string} language
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email,language) => {

  let foundUser = null;
  let typeOfUser = null;

  const user = await userService.getUserByEmail(email);
  if (user) {
    foundUser = user;
    typeOfUser = 'User';
  }

  if (!foundUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }

  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(foundUser.id, expires, tokenTypes.RESET_PASSWORD,typeOfUser);
  await saveResetPasswordToken(resetPasswordToken, foundUser.id,email,language);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user, typeOfUser) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL, typeOfUser);
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL, typeOfUser);
  return verifyEmailToken;
};


/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {string} email
 * @param {string} language
 * @returns {Promise<ResetPassword>}
 */
const saveResetPasswordToken = async (token, userId, email,language) => {
  const tokenDoc = await ResetPassword.create({
    token,
    user: userId,
    email,
    language
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @returns {Promise<ResetPassword>}
 */
const verifyResetPasswordToken = async (token) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await ResetPassword.findOne({ token, user: payload.sub, resetStatus: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};


module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  verifyResetPasswordToken,
  saveResetPasswordToken
};
