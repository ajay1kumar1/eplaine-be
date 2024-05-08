const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBatch = {
  body: Joi.object().keys({
    batchName: Joi.string().required(),
    classNumber: Joi.string().required(),
    boardName: Joi.string().required(),
    language: Joi.string().required(),
    batchTime: Joi.string().required(),
    students: Joi.array().items(Joi.string().custom(objectId)),
    fees: Joi.number().required(),
    teacherSubject: Joi.array().items(
      Joi.object({
        subject: Joi.string().required(),
        teacher: Joi.string().required(),
      })
    ),
  }),
};

const getBatches = {
  query: Joi.object().keys({
    batchName: Joi.string(),
    classNumber: Joi.string(),
    boardName: Joi.string(),

    language: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBatch = {
  params: Joi.object().keys({
    batchId: Joi.string().custom(objectId),
  }),
};

const updateBatch = {
  params: Joi.object().keys({
    batchId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      batchName: Joi.string(),
      classNumber: Joi.string(),
      boardName: Joi.string(),
      language: Joi.string(),
      batchTime: Joi.string(),
      students: Joi.array().items(Joi.string().custom(objectId)),
      fees: Joi.number(),

      teacherSubject: Joi.array().items(
        Joi.object({
          _id: Joi.string(),
          subject: Joi.string(),
          teacher: Joi.string(),
        })
      ),
    })
    .min(1),
};

const deleteBatch = {
  params: Joi.object().keys({
    batchId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBatch,
  getBatches,
  getBatch,
  updateBatch,
  deleteBatch,
};
