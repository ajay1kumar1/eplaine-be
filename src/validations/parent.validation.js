const Joi = require('joi');
const { objectId, password } = require('./custom.validation');
const { createUser } = require('./user.validation');

const createParent = createUser.body.keys({
  children: Joi.array().items(Joi.string().custom(objectId)).unique(),
});

const getParents = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    contactNumber: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getParent = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateParent = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      firstName: Joi.string(),
      middleName: Joi.string(),
      lastName: Joi.string(),
      gender: Joi.string().valid('male', 'female', 'other'),
      contactNumber: Joi.string(),
      role: Joi.string(),
      // additional
      children: Joi.array().items(Joi.string().custom(objectId)).unique(),
    })
    .min(1),
};

const deleteParent = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createParent,
  getParents,
  getParent,
  updateParent,
  deleteParent,
};
