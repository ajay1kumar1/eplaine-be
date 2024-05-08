const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSubject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    teachers: Joi.array().items(Joi.string().custom(objectId)),
  }),
};

const getSubjects = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSubject = {
  params: Joi.object().keys({
    subjectId: Joi.string().custom(objectId),
  }),
};

const updateSubject = {
  params: Joi.object().keys({
    subjectId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      teachers: Joi.array().items(Joi.string().custom(objectId)),
    })
    .min(1),
};

const deleteSubject = {
  params: Joi.object().keys({
    subjectId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
};
