const Joi = require('joi');
const { objectId } = require('./custom.validation');

const questionSchema = {
  type: Joi.string().required(),
  content: Joi.string().required(),
  marks: Joi.number(),
};

const answerSchema = {
  type: Joi.string().required(),
  placeholder: Joi.string(),
  content: Joi.array().items(
    Joi.object({
      choice: Joi.string().allow('').optional(),
      note: Joi.string().allow('').optional(),
    })
  ),
  note: Joi.string().allow('').optional(),
  correctChoice: Joi.string().allow('').optional(),
};

const examSchema = {
  questions: Joi.array().items({
    question: { ...questionSchema },
    answer: { ...answerSchema },
  }),
};

const createExam = {
  body: Joi.object().keys({
    ...examSchema,
    subject: Joi.string().required(),
    classNumber: Joi.string().required(),
    name: Joi.string().required(),
    // Make specific fields required for createExam
    /* dateOfInquiry: examSchema.dateOfInquiry.required(), */
    /* firstName: examSchema.firstName.required(), */
    /* contactNumber: examSchema.contactNumber.required(), */
    /* dateOfBirth: examSchema.dateOfBirth.required(), */
  }),
};

const getExams = {
  query: Joi.object().keys({
    ...examSchema,
    subject: Joi.string(),
    classNumber: Joi.string(),
    name: Joi.string(),

    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getExam = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateExam = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      ...examSchema,
      subject: Joi.string(),
      classNumber: Joi.string(),
      name: Joi.string(),
    })
    .min(1),
};

const deleteExam = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createExam,
  getExams,
  getExam,
  updateExam,
  deleteExam,
};
