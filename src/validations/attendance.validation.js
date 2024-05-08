const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAttendance = {
  body: {
    date: Joi.date().required(),
    batch: Joi.string().required(),
    subject: Joi.string().required(),
    data: Joi.array().items(
      Joi.object({
        student: Joi.string().custom(objectId).required(),
        status: Joi.string().valid('present', 'absent', 'late').required(),
      })
    ),
  },
};

const getAttendances = {
  query: Joi.object().keys({
    date: Joi.date(),
    batch: Joi.string(),
    subject: Joi.string(),
    data: Joi.array().items(
      Joi.object({
        student: Joi.string().custom(objectId),
        status: Joi.string().valid('present', 'absent', 'late'),
      })
    ),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAttendance = {
  params: Joi.object().keys({
    attendanceId: Joi.string().custom(objectId),
  }),
};

const updateAttendance = {
  params: Joi.object().keys({
    attendanceId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      date: Joi.date(),
      batch: Joi.string(),
      subject: Joi.string(),
      data: Joi.array().items(
        Joi.object({
          student: Joi.string(),
          status: Joi.string().valid('present', 'absent', 'late'),
        })
      ),
    })
    .min(1),
};

const deleteAttendance = {
  params: Joi.object().keys({
    attendanceId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAttendance,
  getAttendances,
  getAttendance,
  updateAttendance,
  deleteAttendance,
};
