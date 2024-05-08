const httpStatus = require('http-status');
const { ExamAttempt } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a examAttempt
 * @param {Object} examAttemptBody
 * @returns {Promise<ExamAttempt>}
 */
const createExamAttempt = async (examAttemptBody) => {
  return ExamAttempt.create(examAttemptBody);
};

/**
 * Query for examAttempts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryExamAttempts = async (filter, options) => {
  const examAttempts = await ExamAttempt.paginate(filter, options);
  return examAttempts;
};

/**
 * Get examAttempt by id
 * @param {ObjectId} id
 * @returns {Promise<ExamAttempt>}
 */
const getExamAttemptById = async (id) => {
  return ExamAttempt.findById(id);
};

/**
 * Get examAttempt by email
 * @param {string} email
 * @returns {Promise<ExamAttempt>}
 */
const getExamAttemptByEmail = async (email) => {
  return ExamAttempt.findOne({ email });
};

/**
 * Update examAttempt by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<ExamAttempt>}
 */
const updateExamAttemptById = async (id, updateBody) => {
  const examAttempt = await getExamAttemptById(id);
  if (!examAttempt) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExamAttempt not found');
  }
  if (updateBody.email && (await ExamAttempt.isEmailTaken(updateBody.email, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(examAttempt, updateBody);
  await examAttempt.save();
  return examAttempt;
};

/**
 * Delete examAttempt by id
 * @param {ObjectId} id
 * @returns {Promise<ExamAttempt>}
 */
const deleteExamAttemptById = async (id) => {
  const examAttempt = await getExamAttemptById(id);
  if (!examAttempt) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExamAttempt not found');
  }
  await examAttempt.remove();
  return examAttempt;
};

const getExamAttemptsByBatchId = async (batchId) => {
  const examAttempts = await ExamAttempt.find({
    batches: { $in: [batchId] },
  });

  return examAttempts;
};

module.exports = {
  createExamAttempt,
  queryExamAttempts,
  getExamAttemptById,
  getExamAttemptByEmail,
  updateExamAttemptById,
  deleteExamAttemptById,
  getExamAttemptsByBatchId,
};
