const httpStatus = require('http-status');
const { Payment } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a payment
 * @param {Object} paymentBody
 * @returns {Promise<Payment>}
 */
const createPayment = async (paymentBody) => {
  /* if (await Payment.isEmailTaken(paymentBody.email)) { */
  /*   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken'); */
  /* } */
  return Payment.create(paymentBody);
};

/**
 * Query for payments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPayments = async (filter, options) => {
  const payments = await Payment.paginate(filter, options);
  return payments;
};

/**
 * Get payment by id
 * @param {ObjectId} id
 * @returns {Promise<Payment>}
 */
const getPaymentById = async (id) => {
  return Payment.findById(id);
};

/**
 * Get payment by email
 * @param {string} email
 * @returns {Promise<Payment>}
 */
const getPaymentByEmail = async (email) => {
  return Payment.findOne({ email });
};

/**
 * Update payment by id
 * @param {ObjectId} paymentId
 * @param {Object} updateBody
 * @returns {Promise<Payment>}
 */
const updatePaymentById = async (paymentId, updateBody) => {
  const payment = await getPaymentById(paymentId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  if (updateBody.email && (await Payment.isEmailTaken(updateBody.email, paymentId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(payment, updateBody);
  await payment.save();
  return payment;
};

/**
 * Delete payment by id
 * @param {ObjectId} paymentId
 * @returns {Promise<Payment>}
 */
const deletePaymentById = async (paymentId) => {
  const payment = await getPaymentById(paymentId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  await payment.remove();
  return payment;
};

module.exports = {
  createPayment,
  queryPayments,
  getPaymentById,
  getPaymentByEmail,
  updatePaymentById,
  deletePaymentById,
};
