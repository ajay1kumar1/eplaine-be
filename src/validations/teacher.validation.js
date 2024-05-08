const Joi = require('joi');
const { password, objectId } = require('./custom.validation');
const { createUser } = require('./user.validation');

const createTeacher = createUser.body.keys({
  avatar: Joi.string().required(),
  education: Joi.string().required(),
  address: Joi.string().required(),
  specialization: Joi.array().items(Joi.string().custom(objectId)).optional(),
  subjects: Joi.array().items(Joi.string().custom(objectId)).optional(),
  batches: Joi.array().items(Joi.string().custom(objectId)).optional(),
});

const getTeachers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTeacher = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateTeacher = {
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
      avatar: Joi.string(),
      education: Joi.string(),
      address: Joi.string(),
      specialization: Joi.array().items(Joi.string().custom(objectId)),
      subjects: Joi.array().items(Joi.string().custom(objectId)),
      batches: Joi.array().items(Joi.string().custom(objectId)),
    })
    .min(1),
};

const deleteTeacher = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
};
