const Joi = require('joi');
const { objectId, password } = require('./custom.validation');

const { createUser } = require('./user.validation');

const createStudent = createUser.body.keys({
  admissionId: Joi.string().required(),
  photo: Joi.string(),
  dateOfBirth: Joi.date().required(),
  schoolName: Joi.string(),
  category: Joi.string(),
  parents: Joi.array().items(Joi.string().custom(objectId)),
  address: Joi.string(),
  emergencyContactNumber: Joi.string().required(),
  batches: Joi.array().items(Joi.string().custom(objectId)),
  discount: Joi.number(),
});

const getStudents = {
  query: Joi.object().keys({
    admissionId: Joi.string(),
    firstName: Joi.string(),
    middleName: Joi.string(),
    lastName: Joi.string(),
    contactNumber: Joi.string(),
    email: Joi.string().email(),
    dateOfBirth: Joi.date(),
    schoolName: Joi.string(),
    category: Joi.string(),
    parents: Joi.array().items(Joi.string().custom(objectId)),
    role: Joi.string(),
    name: Joi.string(),
    address: Joi.string(),
    emergencyContactNumber: Joi.string(),
    batches: Joi.array().items(Joi.string().custom(objectId)),
    discount: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getStudent = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateStudent = {
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
      admissionId: Joi.string(),
      photo: Joi.string(),
      dateOfBirth: Joi.date(),
      schoolName: Joi.string(),
      category: Joi.string(),
      parents: Joi.array().items(Joi.string().custom(objectId)),
      address: Joi.string(),
      emergencyContactNumber: Joi.string(),
      batches: Joi.array().items(Joi.string().custom(objectId)),
      discount: Joi.number(),
    })
    .min(1),
};

const deleteStudent = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
};
