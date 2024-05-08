const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    role: Joi.string().required().valid('user', 'admin'),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    middleName: Joi.string(),
    gender: Joi.string().required(),
    contactNumber: Joi.string().required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    email: Joi.string().email(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      middleName: Joi.string(),
      gender: Joi.string(),
      contactNumber: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      role: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
