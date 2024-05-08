const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPayment = {
  body: Joi.object().keys({
    dateTime: Joi.date().required(),
    fees: Joi.number().required(),
    modeOfPayment: Joi.string().required(),
    cardDetails: Joi.string().required(),
    student: Joi.string().custom(objectId).required(),
    transactionNumber: Joi.string().required(),
    invoiceNumber: Joi.string().required(),
  }),
};

const getPayments = {
  query: Joi.object().keys({
    dateTime: Joi.date(),
    fees: Joi.number(),
    modeOfPayment: Joi.string(),
    student: Joi.string().custom(objectId),
    transactionNumber: Joi.string(),
    invoiceNumber: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId),
  }),
};

const updatePayment = {
  params: Joi.object().keys({
    paymentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      dateTime: Joi.date(),
      fees: Joi.number(),
      modeOfPayment: Joi.string(),
      cardDetails: Joi.string(),
      student: Joi.string().custom(objectId),
      transactionNumber: Joi.string(),
      invoiceNumber: Joi.string(),
    })
    .min(1),
};

const deletePayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
};
